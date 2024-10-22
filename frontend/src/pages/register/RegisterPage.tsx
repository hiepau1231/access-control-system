import React from 'react';
import { Card, Typography } from 'antd';
import RegisterForm from '../../components/auth/RegisterForm';
import { UserAddOutlined } from '@ant-design/icons';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <UserAddOutlined className="text-4xl text-blue-500" />
          <Title level={2} className="mt-2">
            Đăng ký
          </Title>
          <Typography.Text className="text-gray-500">
            Tạo tài khoản mới để truy cập hệ thống
          </Typography.Text>
        </div>
        <RegisterForm />
      </Card>
    </div>
  );
};

export default RegisterPage;
