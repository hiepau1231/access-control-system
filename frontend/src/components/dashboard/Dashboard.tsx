import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  DashboardOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface DashboardProps {
  username: string;
}

const Dashboard: React.FC<DashboardProps> = ({ username }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="flex items-center">
        <div className="text-white text-xl">Hệ thống Quản lý Truy cập</div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              Tổng quan
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              Quản lý người dùng
            </Menu.Item>
            <Menu.Item key="3" icon={<LockOutlined />}>
              Quản lý quyền truy cập
            </Menu.Item>
            <Menu.Item key="4" icon={<SettingOutlined />}>
              Cài đặt hệ thống
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Title level={2}>Chào mừng, {username}!</Title>
            <p>Đây là trang tổng quan của hệ thống quản lý truy cập.</p>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
