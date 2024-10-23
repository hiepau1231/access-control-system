import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Spin, ConfigProvider, theme as antdTheme } from 'antd';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/common/Navigation';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const Dashboard = lazy(() => import('./pages/dashboard/DashboardPage'));
const LoginPage = lazy(() => import('./pages/login/LoginPage'));
const RegisterPage = lazy(() => import('./pages/register/RegisterPage'));
const UserManagement = lazy(() => import('./pages/user/UserManagementPage'));
const RoleManagement = lazy(() => import('./pages/role/RoleManagementPage'));
const PermissionManagement = lazy(() => import('./pages/permission/PermissionManagementPage'));
const Settings = lazy(() => import('./pages/settings/SettingsPage'));

const AppContent: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <Router>
        <ErrorBoundary>
          <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <div className="lg:ml-64 transition-all duration-300 ease-in-out">
              <div className={`p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <Suspense fallback={<div className="flex justify-center items-center h-64"><Spin size="large" /></div>}>
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
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </Router>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
