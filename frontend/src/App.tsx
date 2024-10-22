import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UserManagementPage from './pages/user/UserManagementPage';
import AccessManagementPage from './pages/access/AccessManagementPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/access" element={<AccessManagementPage />} />
      </Routes>
    </Router>
  );
};

export default App;
