import React from 'react';
import { Card, Typography } from 'antd';
import LoginForm from '../../components/auth/LoginForm';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const handleLogin = (username: string, password: string) => {
    // TODO: Implement actual login logic here
    console.log('Login attempt:', username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <UserOutlined className="text-4xl text-blue-500" />
          <Title level={2} className="mt-2">
            Đăng nhập
          </Title>
          <Typography.Text className="text-gray-500">
            Chào mừng bạn đến với hệ thống quản lý truy cập và bảo mật dữ liệu
          </Typography.Text>
        </div>
        <LoginForm onLogin={handleLogin} />
      </Card>
    </div>
  );
};

export default LoginPage;
