import React from 'react';
import { Card } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { RegisterForm } from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { register, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card
        title="Register"
        className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}
      >
        <RegisterForm />
      </Card>
    </div>
  );
};

export default RegisterPage;
