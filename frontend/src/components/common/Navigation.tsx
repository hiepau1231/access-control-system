import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { 
  DashboardOutlined, 
  UserOutlined, 
  TeamOutlined, 
  LockOutlined, 
  SettingOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { logout } from '../../services/auth';

const Navigation: React.FC = () => {
  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: 'roles',
      icon: <TeamOutlined />,
      label: <Link to="/roles">Roles</Link>,
    },
    {
      key: 'permissions',
      icon: <LockOutlined />,
      label: <Link to="/permissions">Permissions</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <a onClick={logout}>Logout</a>,
    },
  ];

  return (
    <nav aria-label="Main Navigation">
      <Menu mode="horizontal" items={items} role="menubar" />
    </nav>
  );
};

export default Navigation;
