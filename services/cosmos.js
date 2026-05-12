import { CosmosClient } from '@azure/cosmos';
import { randomUUID } from 'crypto';

function createClient() {
  const conn = process.env.AZURE_COSMOS_CONNECTION_STRING;
  if (conn) return new CosmosClient(conn);
  return new CosmosClient({ endpoint: process.env.AZURE_COSMOS_ENDPOINT, key: process.env.AZURE_COSMOS_KEY });
}

const client = createClient();
const DB_NAME = process.env.AZURE_COSMOS_DB_NAME || 'english-coach';

async function container(name) {
  const { database } = await client.databases.createIfNotExists({ id: DB_NAME });
  const { container: c } = await database.containers.createIfNotExists({ id: name });
  return c;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getOrCreateUser({ oid, email, name }) {
  const c = await container('users');
  try {
    const { resource } = await c.item(oid, oid).read();
    await c.item(oid, oid).patch([{ op: 'replace', path: '/lastLogin', value: new Date().toISOString() }]);
    return resource;
  } catch (err) {
    if (err.code === 404) {
      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
      const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'student';
      const user = { id: oid, email, name, role, sessionCount: 0, createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() };
      const { resource } = await c.items.create(user);
      return resource;
    }
    throw err;
  }
}

export async function getAllUsers() {
  const c = await container('users');
  const { resources } = await c.items.readAll().fetchAll();
  return resources;
}

export async function updateUserRole(userId, role) {
  const c = await container('users');
  await c.item(userId, userId).patch([{ op: 'replace', path: '/role', value: role }]);
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function createSession({ userId, userName, userEmail, topicId, topicTitle, transcription, scores, feedback, words }) {
  const c = await container('sessions');
  const session = {
    id: randomUUID(),
    userId, userName, userEmail,
    topicId, topicTitle,
    transcription, scores, feedback, words: words || [],
    createdAt: new Date().toISOString(),
  };
  const { resource } = await c.items.create(session);

  // Update user: sessionCount + streak
  const uc = await container('users');
  try {
    const { resource: u } = await uc.item(userId, userId).read();
    const today = new Date().toISOString().slice(0, 10);
    const last = u.lastPracticeDate;
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

    let streak = u.currentStreak || 0;
    let practiced = u.practicedToday || false;

    if (last === today) {
      practiced = true; // already counted today
    } else if (last === yesterday) {
      streak += 1;
      practiced = true;
    } else {
      streak = 1;
      practiced = true;
    }

    const longest = Math.max(u.longestStreak || 0, streak);
    const patches = [
      { op: 'replace', path: '/sessionCount', value: (u.sessionCount || 0) + 1 },
      { op: 'replace', path: '/currentStreak', value: streak },
      { op: 'replace', path: '/longestStreak', value: longest },
      { op: 'replace', path: '/lastPracticeDate', value: today },
      { op: 'replace', path: '/practicedToday', value: practiced },
    ];
    await uc.item(userId, userId).patch(patches);
  } catch { /* non-critical */ }

  return resource;
}

export async function getUserSessions(userId) {
  const c = await container('sessions');
  const { resources } = await c.items.query({
    query: 'SELECT * FROM c WHERE c.userId = @uid ORDER BY c.createdAt ASC',
    parameters: [{ name: '@uid', value: userId }],
  }).fetchAll();
  return resources;
}

export async function getStudentSessions(studentId) {
  return getUserSessions(studentId);
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export async function createClass({ name, teacherId, teacherName }) {
  const c = await container('classes');
  const cls = {
    id: randomUUID(),
    name, teacherId, teacherName,
    studentIds: [],
    assignedTopics: [],
    createdAt: new Date().toISOString(),
  };
  const { resource } = await c.items.create(cls);
  return resource;
}

export async function getTeacherClasses(teacherId) {
  const c = await container('classes');
  const { resources } = await c.items.query({
    query: 'SELECT * FROM c WHERE c.teacherId = @tid ORDER BY c.createdAt DESC',
    parameters: [{ name: '@tid', value: teacherId }],
  }).fetchAll();

  // Enrich with stats
  const sessionsCtr = await container('sessions');
  return Promise.all(resources.map(async (cls) => {
    if (!cls.studentIds.length) return { ...cls, studentCount: 0, sessionCount: 0 };
    const { resources: sessions } = await sessionsCtr.items.query({
      query: `SELECT c.scores FROM c WHERE ARRAY_CONTAINS(@ids, c.userId)`,
      parameters: [{ name: '@ids', value: cls.studentIds }],
    }).fetchAll();
    const scores = sessions.flatMap((s) => Object.values(s.scores || {}).filter((v) => v != null));
    const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
    return { ...cls, studentCount: cls.studentIds.length, sessionCount: sessions.length, avgScore };
  }));
}

export async function getClassById(classId) {
  const c = await container('classes');
  const { resource } = await c.item(classId, classId).read();
  return resource;
}

export async function addStudentToClass(classId, studentId) {
  const c = await container('classes');
  const { resource: cls } = await c.item(classId, classId).read();
  if (cls.studentIds.includes(studentId)) return cls;
  cls.studentIds.push(studentId);
  await c.item(classId, classId).replace(cls);
  return cls;
}

export async function removeStudentFromClass(classId, studentId) {
  const c = await container('classes');
  const { resource: cls } = await c.item(classId, classId).read();
  cls.studentIds = cls.studentIds.filter((id) => id !== studentId);
  await c.item(classId, classId).replace(cls);
}

export async function updateClassTopics(classId, topicIds) {
  const c = await container('classes');
  await c.item(classId, classId).patch([{ op: 'replace', path: '/assignedTopics', value: topicIds }]);
}

export async function getClassStudents(cls) {
  if (!cls.studentIds.length) return [];
  const uc = await container('users');
  const sc = await container('sessions');
  return Promise.all(cls.studentIds.map(async (sid) => {
    let user = {};
    try { ({ resource: user } = await uc.item(sid, sid).read()); } catch { user = { id: sid, name: 'Unknown', email: '' }; }
    const { resources: sessions } = await sc.items.query({
      query: 'SELECT c.scores, c.createdAt FROM c WHERE c.userId = @uid ORDER BY c.createdAt DESC',
      parameters: [{ name: '@uid', value: sid }],
    }).fetchAll();
    const allScores = sessions.flatMap((s) => Object.values(s.scores || {}).filter((v) => v != null));
    const avgScore = allScores.length ? allScores.reduce((a, b) => a + b, 0) / allScores.length : null;
    return { id: sid, name: user.name, email: user.email, sessionCount: sessions.length, avgScore, lastSession: sessions[0]?.createdAt || null };
  }));
}

export async function getUserById(userId) {
  const c = await container('users');
  const { resource } = await c.item(userId, userId).read();
  return resource;
}

export async function getSystemStats() {
  const [uc, sc, cc] = await Promise.all([container('users'), container('sessions'), container('classes')]);
  const [users, sessionCount, classCount] = await Promise.all([
    uc.items.readAll().fetchAll().then((r) => r.resources),
    sc.items.query('SELECT VALUE COUNT(1) FROM c').fetchAll().then((r) => r.resources[0] || 0),
    cc.items.query('SELECT VALUE COUNT(1) FROM c').fetchAll().then((r) => r.resources[0] || 0),
  ]);
  return {
    totalUsers: users.length,
    totalTeachers: users.filter((u) => u.role === 'teacher').length,
    totalStudents: users.filter((u) => u.role === 'student').length,
    totalAdmins: users.filter((u) => u.role === 'admin').length,
    totalSessions: sessionCount,
    totalClasses: classCount,
  };
}
