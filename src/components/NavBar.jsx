import { useMsal } from '@azure/msal-react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const ROLE_COLORS = { admin: '#f0a500', teacher: '#6c63ff', student: '#4caf84' };
const ROLE_LABELS = { admin: 'Admin', teacher: 'Teacher', student: 'Student' };

export default function NavBar({ user }) {
  const { instance } = useMsal();
  const location = useLocation();

  const handleLogout = () => instance.logoutPopup({ postLogoutRedirectUri: '/' });
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="navbar-icon">🎙️</span>
          <span className="navbar-title">Speaking Coach</span>
        </div>

        <div className="navbar-links">
          {(user?.role === 'student' || user?.role === 'admin') && (
            <>
              <Link to="/practice"  className={isActive('/practice')  ? 'nav-link active' : 'nav-link'}>Practice</Link>
              <Link to="/shadowing" className={isActive('/shadowing') ? 'nav-link active' : 'nav-link'}>Shadowing</Link>
              <Link to="/progress"  className={isActive('/progress')  ? 'nav-link active' : 'nav-link'}>My Progress</Link>
            </>
          )}
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <Link to="/teacher" className={isActive('/teacher') ? 'nav-link active' : 'nav-link'}>Dashboard</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className={isActive('/admin') ? 'nav-link active' : 'nav-link'}>Admin</Link>
          )}
        </div>

        <div className="navbar-user">
          {user && (
            <>
              <span className="role-badge" style={{ background: `${ROLE_COLORS[user.role]}22`, color: ROLE_COLORS[user.role], border: `1px solid ${ROLE_COLORS[user.role]}44` }}>
                {ROLE_LABELS[user.role] || user.role}
              </span>
              {user.currentStreak > 0 && (
                <span className="streak-badge" title={`${user.currentStreak}-day streak`}>🔥 {user.currentStreak}</span>
              )}
              <span className="navbar-name">{user.name}</span>
            </>
          )}
          <button className="btn-logout" onClick={handleLogout} title="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
