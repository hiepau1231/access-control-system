import React, { useState } from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useTheme } from '../../contexts/ThemeContext';
import { login } from '../../services/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await login(username, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        message.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      message.error('Invalid username or password');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card
        title="Login"
        bordered={false}
        className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}
      >
        <LoginForm onLogin={handleLogin} loading={loading} />
      </Card>
    </div>
  );
};

export default LoginPage;
