import React from 'react';
import { Typography, Card } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <div className="flex items-center mb-4">
          <SettingOutlined className="text-3xl text-blue-500 mr-4" />
          <Title level={2} className="m-0">Cài đặt hệ thống</Title>
        </div>
        <Typography.Text className="text-gray-500">
          Cấu hình và tùy chỉnh các thiết lập hệ thống
        </Typography.Text>
      </Card>
      {/* Thêm các component cài đặt ở đây */}
    </div>
  );
};

export default SettingsPage;
