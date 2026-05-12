import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import NavBar from './components/NavBar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PracticePage from './pages/PracticePage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import ShadowingPage from './pages/ShadowingPage.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import ClassPage from './pages/ClassPage.jsx';
import StudentDetailPage from './pages/StudentDetailPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import { useApi } from './hooks/useApi.js';
import './App.css';

function AppInner() {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  const fetchUser = useCallback(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    return get('/api/me')
      .then((r) => r.json())
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, accounts.length]);

  useEffect(() => { fetchUser(); }, [isAuthenticated, accounts.length]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  const defaultPath =
    user?.role === 'admin' ? '/admin' :
    user?.role === 'teacher' ? '/teacher' : '/practice';

  const studentRoutes = ['student', 'admin'];
  const teacherRoutes = ['teacher', 'admin'];

  return (
    <BrowserRouter>
      {isAuthenticated && <NavBar user={user} />}
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to={defaultPath} replace /> : <LoginPage />} />

        <Route path="/practice" element={
          <ProtectedRoute user={user} allowedRoles={studentRoutes}>
            <PracticePage user={user} onUserUpdate={fetchUser} />
          </ProtectedRoute>
        } />

        <Route path="/shadowing" element={
          <ProtectedRoute user={user} allowedRoles={studentRoutes}>
            <ShadowingPage user={user} />
          </ProtectedRoute>
        } />

        <Route path="/progress" element={
          <ProtectedRoute user={user} allowedRoles={studentRoutes}>
            <ProgressPage user={user} />
          </ProtectedRoute>
        } />

        <Route path="/teacher" element={
          <ProtectedRoute user={user} allowedRoles={teacherRoutes}>
            <TeacherDashboard user={user} />
          </ProtectedRoute>
        } />

        <Route path="/teacher/classes/:classId" element={
          <ProtectedRoute user={user} allowedRoles={teacherRoutes}>
            <ClassPage user={user} />
          </ProtectedRoute>
        } />

        <Route path="/teacher/students/:studentId" element={
          <ProtectedRoute user={user} allowedRoles={teacherRoutes}>
            <StudentDetailPage user={user} />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <AdminPage user={user} />
          </ProtectedRoute>
        } />

        <Route path="*" element={
          isAuthenticated && user
            ? <Navigate to={defaultPath} replace />
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppInner />;
}
