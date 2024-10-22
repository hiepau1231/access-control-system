import React from 'react';
import { Card, Typography } from 'antd';
import RegisterForm from '../../components/auth/RegisterForm';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          Đăng ký
        </Title>
        <RegisterForm />
      </Card>
    </div>
  );
};

export default RegisterPage;
