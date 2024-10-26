import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import UserManagement from './components/user/UserManagement';
import RoleManagement from './components/role/RoleManagement';
import PermissionManagement from './components/permission/PermissionManagement';
import { RoleHierarchyManagement } from './components/role/RoleHierarchyManagement';
import MainLayout from './components/layout/MainLayout';
import { ThemeProvider } from './contexts/ThemeContext';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{element}</MainLayout>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users" element={<PrivateRoute element={<UserManagement />} />} />
          <Route path="/roles" element={<PrivateRoute element={<RoleManagement />} />} />
          <Route path="/permissions" element={<PrivateRoute element={<PermissionManagement />} />} />
          <Route path="/roles/hierarchy" element={<PrivateRoute element={<RoleHierarchyManagement />} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
