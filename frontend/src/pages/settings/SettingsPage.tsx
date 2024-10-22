import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={2}>Cài đặt hệ thống</Title>
      {/* TODO: Add settings form or components */}
    </div>
  );
};

export default SettingsPage;
