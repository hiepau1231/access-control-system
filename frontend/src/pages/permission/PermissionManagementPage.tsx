import React from 'react';
import { Typography, Card } from 'antd';
import PermissionManagement from '../../components/permission/PermissionManagement';
import { KeyOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PermissionManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <div className="flex items-center mb-4">
          <KeyOutlined className="text-3xl text-blue-500 mr-4" />
          <Title level={2} className="m-0">Quản lý quyền truy cập</Title>
        </div>
        <Typography.Text className="text-gray-500">
          Quản lý các quyền truy cập chi tiết trong hệ thống
        </Typography.Text>
      </Card>
      <PermissionManagement />
    </div>
  );
};

export default PermissionManagementPage;
