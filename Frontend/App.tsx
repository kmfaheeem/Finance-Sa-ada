import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Actions } from './pages/admin/Actions';
import { StudentFunds } from './pages/admin/StudentFunds';
import { ClassFunds } from './pages/admin/ClassFunds';
import { Reports } from './pages/student/Reports';

// Route Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { currentUser } = useFinance();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on role if unauthorized
    return <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/reports'} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/actions" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><Actions /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/students-fund" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><StudentFunds /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/class-fund" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><ClassFunds /></Layout>
          </ProtectedRoute>
        } 
      />

      {/* Student/Shared Routes */}
      <Route 
        path="/student/reports" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'student']}>
            <Layout><Reports /></Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <FinanceProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </FinanceProvider>
  );
};

export default App;