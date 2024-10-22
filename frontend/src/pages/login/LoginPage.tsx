import React from 'react';
import { Card, Typography } from 'antd';
import LoginForm from '../../components/auth/LoginForm';

const { Title } = Typography;

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginPage: React.FC = () => {
  const handleLogin = (username: string, password: string) => {
    // TODO: Implement actual login logic here
    console.log('Login attempt:', username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          Đăng nhập
        </Title>
        <LoginForm onLogin={handleLogin} />
      </Card>
    </div>
  );
};

export default LoginPage;
