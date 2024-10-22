import React from 'react';
import { Typography } from 'antd';
import UserManagement from '../../components/user/UserManagement';

const { Title } = Typography;

const UserManagementPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Quản lý người dùng</Title>
      <UserManagement />
    </div>
  );
};

export default UserManagementPage;
