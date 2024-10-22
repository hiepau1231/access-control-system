import React from 'react';
import { Typography } from 'antd';
import PermissionManagement from '../../components/permission/PermissionManagement';

const { Title } = Typography;

const PermissionManagementPage: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={2}>Quản lý quyền truy cập</Title>
      <PermissionManagement />
    </div>
  );
};

export default PermissionManagementPage;
