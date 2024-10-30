import React from 'react';
import { Card } from 'antd';
import { LoginForm } from '../../components/auth/LoginForm';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card
        title="Login"
        className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}
      >
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;
