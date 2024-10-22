import React from 'react';
import { Typography, Card } from 'antd';
import UserManagement from '../../components/user/UserManagement';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <div className="flex items-center mb-4">
          <UserOutlined className="text-3xl text-blue-500 mr-4" />
          <Title level={2} className="m-0">Quản lý người dùng</Title>
        </div>
        <Typography.Text className="text-gray-500">
          Quản lý thông tin và quyền truy cập của người dùng trong hệ thống
        </Typography.Text>
      </Card>
      <UserManagement />
    </div>
  );
};

export default UserManagementPage;
