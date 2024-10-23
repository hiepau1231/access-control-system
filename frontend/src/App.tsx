import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/common/Navigation';
import './styles/animations.css';
import 'antd/dist/antd.min.css';

const { Header, Content } = Layout;

const Dashboard = lazy(() => import('./pages/dashboard/DashboardPage'));
const LoginPage = lazy(() => import('./pages/login/LoginPage'));
const RegisterPage = lazy(() => import('./pages/register/RegisterPage'));
const UserManagement = lazy(() => import('./pages/user/UserManagementPage'));
const RoleManagement = lazy(() => import('./pages/role/RoleManagementPage'));
const PermissionManagement = lazy(() => import('./pages/permission/PermissionManagementPage'));
const Settings = lazy(() => import('./pages/settings/SettingsPage'));

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Layout>
          <Header>
            <Navigation />
          </Header>
          <Content style={{ padding: '20px' }}>
            <Suspense fallback={<Spin size="large" />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/roles" element={<RoleManagement />} />
                <Route path="/permissions" element={<PermissionManagement />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Suspense>
          </Content>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
