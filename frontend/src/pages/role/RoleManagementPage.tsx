import React from 'react';
import { Typography, Card } from 'antd';
import RoleManagement from '../../components/role/RoleManagement';
import { SafetyCertificateOutlined } from '@ant-design/icons';

const { Title } = Typography;

const RoleManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <div className="flex items-center mb-4">
          <SafetyCertificateOutlined className="text-3xl text-blue-500 mr-4" />
          <Title level={2} className="m-0">Quản lý vai trò</Title>
        </div>
        <Typography.Text className="text-gray-500">
          Quản lý các vai trò và phân quyền trong hệ thống
        </Typography.Text>
      </Card>
      <RoleManagement />
    </div>
  );
};

export default RoleManagementPage;
