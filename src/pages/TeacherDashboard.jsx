import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';

export default function TeacherDashboard({ user }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const { get, post } = useApi();

  const load = () =>
    get('/api/teacher/classes')
      .then((r) => r.json())
      .then(setClasses)
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await post('/api/teacher/classes', { name: newName.trim() });
      if (res.ok) { setNewName(''); load(); }
    } finally { setCreating(false); }
  };

  const totalStudents = classes.reduce((acc, c) => acc + (c.studentCount || 0), 0);
  const totalSessions = classes.reduce((acc, c) => acc + (c.sessionCount || 0), 0);

  return (
    <div className="page-wide">
      <div className="page-heading">
        <h1>Teacher Dashboard</h1>
        <p>Welcome back, {user?.name}</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{classes.length}</div>
          <div className="stat-label">Classes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-label">Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalSessions}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p className="section-title" style={{ margin: 0 }}>My Classes</p>
      </div>

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <input
          className="text-input"
          placeholder="New class name…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn-primary" type="submit" disabled={creating || !newName.trim()}>
          {creating ? 'Creating…' : '+ Create Class'}
        </button>
      </form>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>}

      {!loading && classes.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🏫</div>
          <p>No classes yet. Create your first class above to get started.</p>
        </div>
      )}

      {!loading && classes.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {classes.map((cls) => (
            <Link key={cls.id} to={`/teacher/classes/${cls.id}`} style={{ textDecoration: 'none' }}>
              <div className="class-card">
                <div className="class-card-name">{cls.name}</div>
                <div className="class-card-stats">
                  <span>👥 {cls.studentCount || 0} students</span>
                  <span>📝 {cls.sessionCount || 0} sessions</span>
                </div>
                {cls.avgScore != null && (
                  <div className="class-card-score">
                    Avg score <strong>{Math.round(cls.avgScore)}</strong>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
