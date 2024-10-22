import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UserManagementPage from './pages/user/UserManagementPage';
import RoleManagementPage from './pages/role/RoleManagementPage';
import PermissionManagementPage from './pages/permission/PermissionManagementPage';
import SettingsPage from './pages/settings/SettingsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/roles" element={<RoleManagementPage />} />
        <Route path="/permissions" element={<PermissionManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
