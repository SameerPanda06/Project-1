import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';

import AdminDashboard from './pages/AdminDashboard';
import AdminSchedule from './pages/AdminSchedule';
import AdminNotifications from './pages/AdminNotifications';
import AdminProfile from './pages/AdminProfile';

import TeacherDashboard from './pages/TeacherDashboard';
import TeacherSchedule from './pages/TeacherSchedule';
import TeacherNotifications from './pages/TeacherNotifications';
import TeacherProfile from './pages/TeacherProfile';
import TeacherLeave from './pages/TeacherLeave';
import TeacherLeaveHistory from './pages/TeacherLeaveHistory';

import StudentDashboard from './pages/StudentDashboard';
import StudentTimetable from './pages/StudentTimetable';
import StudentNotifications from './pages/StudentNotifications';
import StudentProfile from './pages/StudentProfile';

// ProtectedRoute component to handle role-based access
function ProtectedRoute({ userRole, allowedRoles, redirectPath = '/login', children }) {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
}

function App() {
  // TODO: Get userRole dynamically from auth context or storage
  const userRole = /* 'Admin' | 'Teacher' | 'Student' | null */ null;

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schedule"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin']}>
              <AdminSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin']}>
              <AdminNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin']}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* Teacher routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/schedule"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Teacher']}>
              <TeacherSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/notifications"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Teacher']}>
              <TeacherNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Teacher']}>
              <TeacherProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/leave"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Teacher']}>
              <TeacherLeave />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/teacher/leave/history"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Teacher']}>
              <TeacherLeaveHistory />
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/timetable"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Student']}>
              <StudentTimetable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Student']}>
              <StudentNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Student']}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
