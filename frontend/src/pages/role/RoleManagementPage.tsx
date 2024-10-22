import React from 'react';
import { Typography } from 'antd';
import RoleManagement from '../../components/role/RoleManagement';

const { Title } = Typography;

const RoleManagementPage: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={2}>Quản lý vai trò</Title>
      <RoleManagement />
    </div>
  );
};

export default RoleManagementPage;
