import React from 'react';
import { Typography } from 'antd';
import AccessManagement from '../../components/access/AccessManagement';

const { Title } = Typography;

const AccessManagementPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Quản lý quyền truy cập</Title>
      <AccessManagement />
    </div>
  );
};

export default AccessManagementPage;
