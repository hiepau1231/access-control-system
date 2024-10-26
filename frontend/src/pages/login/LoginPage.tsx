import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { Card, message } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { login } from '../../services/api';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await login(username, password);
      console.log('Login response:', response); // Debug log
      
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        message.success('Login successful!');
        navigate('/users');
      } else {
        message.error('Invalid response from server');
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      } else {
        message.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card
        title="Login"
        className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}
      >
        <LoginForm onLogin={handleLogin} />
      </Card>
    </div>
  );
};

export default LoginPage;
