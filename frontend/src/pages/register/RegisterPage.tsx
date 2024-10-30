import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { Card, message } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { register } from '../../services/api';

interface RegisterValues {
  username: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleRegister = async (values: RegisterValues) => {
    try {
      const { username, email, password } = values;
      await register(username, email, password);
      message.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      message.error('Registration failed!');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card
        title="Register"
        bordered={false}
        className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}
      >
        <RegisterForm onRegister={handleRegister} />
      </Card>
    </div>
  );
};

export default RegisterPage;
