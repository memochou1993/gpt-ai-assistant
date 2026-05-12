import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { authenticate, requireRole } from '../middleware/auth.js';
import { assessPronunciation } from '../services/azure-speech.js';
import { analyzeGrammarAndVocabulary } from '../services/azure-openai.js';
import {
  getUserSessions, createSession,
  getTeacherClasses, createClass, getClassById, addStudentToClass,
  removeStudentFromClass, updateClassTopics, getClassStudents,
  getAllUsers, updateUserRole, getUserById, getSystemStats,
  getStudentSessions, getOrCreateUser,
} from '../services/cosmos.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

// ─── Auth ─────────────────────────────────────────────────────────────────────

app.get('/api/me', authenticate, (req, res) => {
  res.json(req.user);
});

// ─── Speech assessment ────────────────────────────────────────────────────────

app.post('/api/assess', authenticate, upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No audio file received.' });
  try {
    const result = await assessPronunciation(req.file.buffer, req.file.mimetype || 'audio/webm');
    return res.json(result);
  } catch (err) {
    console.error('[assess]', err.message);
    return res.status(502).json({ message: err.message });
  }
});

app.post('/api/grammar', authenticate, async (req, res) => {
  const { transcription, topic } = req.body || {};
  if (!transcription?.trim()) return res.status(400).json({ message: 'No transcription provided.' });
  try {
    const result = await analyzeGrammarAndVocabulary(transcription, topic || null);
    return res.json(result);
  } catch (err) {
    console.error('[grammar]', err.message);
    return res.status(502).json({ message: err.message });
  }
});

// ─── Sessions (student) ───────────────────────────────────────────────────────

app.post('/api/sessions', authenticate, async (req, res) => {
  const { topicId, topicTitle, transcription, scores, feedback } = req.body || {};
  try {
    const session = await createSession({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      topicId, topicTitle, transcription, scores, feedback,
    });
    return res.json(session);
  } catch (err) {
    console.error('[sessions POST]', err.message);
    return res.status(500).json({ message: err.message });
  }
});

app.get('/api/sessions', authenticate, async (req, res) => {
  try {
    const sessions = await getUserSessions(req.user.id);
    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: classes ─────────────────────────────────────────────────────────

app.get('/api/teacher/classes', authenticate, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const classes = await getTeacherClasses(req.user.id);
    return res.json(classes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post('/api/teacher/classes', authenticate, requireRole('teacher', 'admin'), async (req, res) => {
  const { name } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ message: 'Class name is required.' });
  try {
    const cls = await createClass({ name: name.trim(), teacherId: req.user.id, teacherName: req.user.name });
    return res.json(cls);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get('/api/teacher/classes/:classId', authenticate, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const cls = await getClassById(req.params.classId);
    if (!cls) return res.status(404).json({ message: 'Class not found.' });
    const students = await getClassStudents(cls);
    return res.json({ class: cls, students });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post('/api/teacher/classes/:classId/students', authenticate, requireRole('teacher', 'admin'), async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Email required.' });
  try {
    const allUsers = await getAllUsers();
    const student = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!student) return res.status(404).json({ message: 'No user found with that email.' });
    await addStudentToClass(req.params.classId, student.id);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.delete('/api/teacher/classes/:classId/students/:studentId', authenticate, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    await removeStudentFromClass(req.params.classId, req.params.studentId);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post('/api/teacher/classes/:classId/topics', authenticate, requireRole('teacher', 'admin'), async (req, res) => {
  const { topicIds } = req.body || {};
  try {
    await updateClassTopics(req.params.classId, topicIds || []);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ─── Teacher: student detail ──────────────────────────────────────────────────

app.get('/api/teacher/students/:studentId', authenticate, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const student = await getUserById(req.params.studentId);
    return res.json(student);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get('/api/teacher/students/:studentId/sessions', authenticate, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const sessions = await getStudentSessions(req.params.studentId);
    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ─── Admin ────────────────────────────────────────────────────────────────────

app.get('/api/admin/users', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.put('/api/admin/users/:userId/role', authenticate, requireRole('admin'), async (req, res) => {
  const { role } = req.body || {};
  if (!['student', 'teacher', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role.' });
  try {
    await updateUserRole(req.params.userId, role);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get('/api/admin/stats', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const stats = await getSystemStats();
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ─── SPA fallback ─────────────────────────────────────────────────────────────

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app;
