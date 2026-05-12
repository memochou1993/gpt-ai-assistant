import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'teacher' || user.role === 'admin' ? '/teacher' : '/practice';
    return <Navigate to={fallback} replace />;
  }
  return children;
}
