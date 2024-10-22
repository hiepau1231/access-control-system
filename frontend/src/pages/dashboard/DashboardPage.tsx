import React from 'react';
import { Typography, Button, Space } from 'antd';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const username = "Người dùng"; // TODO: Fetch actual user data

  return (
    <div className="p-6">
      <Title level={2}>Xin chào, {username}</Title>
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        <Link to="/users">
          <Button type="primary">Quản lý người dùng</Button>
        </Link>
        <Link to="/roles">
          <Button type="primary">Quản lý vai trò</Button>
        </Link>
        <Link to="/permissions">
          <Button type="primary">Quản lý quyền truy cập</Button>
        </Link>
        <Link to="/settings">
          <Button type="primary">Cài đặt hệ thống</Button>
        </Link>
      </Space>
    </div>
  );
};

export default DashboardPage;
