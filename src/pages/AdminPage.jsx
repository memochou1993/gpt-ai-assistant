import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi.js';

const ROLES = ['student', 'teacher', 'admin'];
const ROLE_COLORS = { admin: '#f0a500', teacher: '#6c63ff', student: '#4caf84' };

export default function AdminPage({ user }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const { get, put } = useApi();

  const load = () =>
    Promise.all([
      get('/api/admin/users').then((r) => r.json()),
      get('/api/admin/stats').then((r) => r.json()),
    ])
      .then(([u, s]) => { setUsers(u); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (userId === user?.id) { alert("You can't change your own role."); return; }
    setUpdating(userId);
    const res = await put(`/api/admin/users/${userId}/role`, { role: newRole });
    if (res.ok) setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    setUpdating(null);
  };

  return (
    <div className="page-wide">
      <div className="page-heading">
        <h1>Admin Panel</h1>
        <p>Manage users, roles, and system settings</p>
      </div>

      {stats && (
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Users</div></div>
          <div className="stat-card"><div className="stat-value">{stats.totalTeachers}</div><div className="stat-label">Teachers</div></div>
          <div className="stat-card"><div className="stat-value">{stats.totalStudents}</div><div className="stat-label">Students</div></div>
          <div className="stat-card"><div className="stat-value">{stats.totalSessions}</div><div className="stat-label">Practice Sessions</div></div>
          <div className="stat-card"><div className="stat-value">{stats.totalClasses}</div><div className="stat-label">Classes</div></div>
        </div>
      )}

      <p className="section-title">User Management</p>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>}

      {!loading && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Sessions</th>
                <th>Last Login</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>
                    {u.name}
                    {u.id === user?.id && <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 6 }}>(you)</span>}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px', background: `${ROLE_COLORS[u.role]}22`, color: ROLE_COLORS[u.role], border: `1px solid ${ROLE_COLORS[u.role]}44` }}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.sessionCount || 0}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    {u.id !== user?.id ? (
                      <select
                        className="role-select"
                        value={u.role}
                        disabled={updating === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
