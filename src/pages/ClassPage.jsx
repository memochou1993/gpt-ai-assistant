import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';

const TOPICS = [
  { id: 1, title: 'Describe your ideal weekend' },
  { id: 2, title: 'Your favorite hobby' },
  { id: 3, title: 'A memorable travel experience' },
  { id: 4, title: 'Technology in daily life' },
  { id: 5, title: 'A person who inspired you' },
  { id: 6, title: 'Future career goals' },
  { id: 7, title: 'The importance of learning languages' },
  { id: 8, title: 'Your hometown' },
  { id: 9, title: 'A challenge you overcame' },
  { id: 10, title: 'Books vs. movies' },
];

function scoreClass(v) {
  if (v == null) return '';
  if (v >= 80) return 'score-high';
  if (v >= 60) return 'score-mid';
  return 'score-low';
}

export default function ClassPage() {
  const { classId } = useParams();
  const [cls, setCls] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addEmail, setAddEmail] = useState('');
  const [addError, setAddError] = useState('');
  const [saving, setSaving] = useState(false);
  const { get, post, del } = useApi();

  const load = () =>
    get(`/api/teacher/classes/${classId}`)
      .then((r) => r.json())
      .then((data) => { setCls(data.class); setStudents(data.students); })
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, [classId]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!addEmail.trim()) return;
    setSaving(true); setAddError('');
    const res = await post(`/api/teacher/classes/${classId}/students`, { email: addEmail.trim() });
    if (res.ok) { setAddEmail(''); load(); }
    else { const d = await res.json().catch(() => ({})); setAddError(d.message || 'User not found.'); }
    setSaving(false);
  };

  const handleRemoveStudent = async (studentId) => {
    if (!confirm('Remove this student from the class?')) return;
    await del(`/api/teacher/classes/${classId}/students/${studentId}`);
    load();
  };

  const handleToggleTopic = async (topicId) => {
    const assigned = cls?.assignedTopics || [];
    const updated = assigned.includes(topicId) ? assigned.filter((t) => t !== topicId) : [...assigned, topicId];
    const res = await post(`/api/teacher/classes/${classId}/topics`, { topicIds: updated });
    if (res.ok) setCls((c) => ({ ...c, assignedTopics: updated }));
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;

  return (
    <div className="page-wide">
      <div className="page-heading">
        <Link to="/teacher" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', display: 'block', marginBottom: 6 }}>← Back to Dashboard</Link>
        <h1>{cls?.name || 'Class'}</h1>
        <p>{students.length} students enrolled</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        {/* Students table */}
        <div>
          <p className="section-title">Students</p>
          <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <input className="text-input" placeholder="Student email address…" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} style={{ flex: 1 }} />
            <button className="btn-primary" type="submit" disabled={saving || !addEmail.trim()}>{saving ? 'Adding…' : '+ Add'}</button>
          </form>
          {addError && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>⚠️ {addError}</p>}

          {students.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">👥</div><p>No students yet. Add students by their email address.</p></div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>Name</th><th>Sessions</th><th>Avg Score</th><th>Last Active</th><th></th></tr></thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <Link to={`/teacher/students/${s.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>{s.name}</Link>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.email}</div>
                      </td>
                      <td>{s.sessionCount || 0}</td>
                      <td>{s.avgScore != null ? <span className={`score-pill ${scoreClass(s.avgScore)}`}>{Math.round(s.avgScore)}</span> : '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.lastSession ? new Date(s.lastSession).toLocaleDateString() : '—'}</td>
                      <td><button className="btn-danger" onClick={() => handleRemoveStudent(s.id)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Topics panel */}
        <div>
          <p className="section-title">Assigned Topics</p>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Students will only see selected topics in Practice.</p>
            {TOPICS.map((t) => {
              const active = cls?.assignedTopics?.includes(t.id);
              return (
                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 4px', borderRadius: 6, transition: 'background 0.1s' }}>
                  <input type="checkbox" checked={active || false} onChange={() => handleToggleTopic(t.id)} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
                  <span style={{ fontSize: 13, color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{t.title}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
