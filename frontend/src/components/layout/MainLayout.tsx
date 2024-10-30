import React from 'react';
import { Layout } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from '../common/Navigation';
import { PrivateRoute } from '../auth/PrivateRoute';
import LoginPage from '../../pages/login/LoginPage';
import RegisterForm from '../auth/RegisterForm';
import UserManagement from '../user/UserManagement';
import RoleManagement from '../role/RoleManagement';
import PermissionManagement from '../permission/PermissionManagement';
import Dashboard from '../dashboard/Dashboard';
import { useAuth } from '../../hooks/useAuth';

const { Header, Content } = Layout;

export const MainLayout: React.FC = () => {
  const { user } = useAuth();

  const handleRegister = async (values: any) => {
    // Implement register logic
    console.log('Register:', values);
  };

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterForm onRegister={handleRegister} />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Header>
                  <Navigation />
                </Header>
                <Content className="p-6">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route 
                      path="/dashboard" 
                      element={<Dashboard username={user?.username || ''} />} 
                    />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/roles" element={<RoleManagement />} />
                    <Route path="/permissions" element={<PermissionManagement />} />
                  </Routes>
                </Content>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default MainLayout;
