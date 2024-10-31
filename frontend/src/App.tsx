import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntApp, message } from 'antd';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import Dashboard from './pages/dashboard/Dashboard';
import UserManagementPage from './pages/user/UserManagementPage';
import RoleManagementPage from './pages/role/RoleManagementPage';
import RoleHierarchyManagementPage from './pages/role/RoleHierarchyManagementPage';
import PermissionManagementPage from './pages/permission/PermissionManagementPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { errorReporting, handleError } from './utils/errorReporting';
import { LoadingProvider } from './contexts/LoadingContext';
import { LoadingIndicator } from './components/common/LoadingIndicator';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute>
          <MainLayout>
            <UserManagementPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/roles" element={
        <ProtectedRoute>
          <MainLayout>
            <RoleManagementPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/roles/hierarchy" element={
        <ProtectedRoute>
          <MainLayout>
            <RoleHierarchyManagementPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/permissions" element={
        <ProtectedRoute>
          <MainLayout>
            <PermissionManagementPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* Root route */}
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* Catch all route - Keep current route if authenticated */}
      <Route path="*" element={
        isAuthenticated ? (
          <Navigate to="." replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
};

const AppContent: React.FC = () => {
  useEffect(() => {
    // Initialize error reporting
    errorReporting.initialize();
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary
        onError={(error, errorInfo) => {
          const errorMessage = handleError(error, errorInfo);
          message.error(errorMessage);
        }}
      >
        <AntApp>
          <ThemeProvider>
            <LoadingProvider>
              <AuthProvider>
                <LoadingIndicator fullScreen />
                <AppRoutes />
              </AuthProvider>
            </LoadingProvider>
          </ThemeProvider>
        </AntApp>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

// Export the main App component
const App: React.FC = () => {
  return (
    <ErrorBoundary
      onError={(error) => {
        console.error('Critical error in app root:', error);
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Critical Error
              </h1>
              <p className="text-gray-600 mb-4">
                The application has encountered a critical error and needs to be reloaded.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Reload Application
              </button>
            </div>
          </div>
        );
      }}
    >
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;