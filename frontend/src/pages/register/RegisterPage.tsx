import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { Card, message } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { register } from '../../services/api';
import axios from 'axios';

const RegisterPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      await register(username, email, password);
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || 'Registration failed. Please try again.');
        console.error('Registration error:', error.response?.data);
      } else {
        message.error('Registration failed. Please try again.');
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card
        title="Register"
        className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}
      >
        <RegisterForm onRegister={handleRegister} />
      </Card>
    </div>
  );
};

export default RegisterPage;
