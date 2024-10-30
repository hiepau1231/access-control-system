import React from 'react';
import { Menu, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useAuth } from '../../hooks';
import { useTheme } from '../../contexts/ThemeContext';
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
  LoginOutlined,
  SettingOutlined,
  ApartmentOutlined
} from '@ant-design/icons';

export const Navigation = (): JSX.Element => {
  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      message.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      message.error('Failed to logout. Please try again.');
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>
    },
    ...(isAuthenticated ? [
      {
        key: 'management',
        icon: <SettingOutlined />,
        label: 'Management',
        children: [
          {
            key: 'users',
            icon: <UserOutlined />,
            label: <Link to="/users">Users</Link>
          },
          {
            key: 'roles',
            icon: <TeamOutlined />,
            label: 'Roles',
            children: [
              {
                key: 'role-management',
                label: <Link to="/roles">Role Management</Link>
              },
              {
                key: 'role-hierarchy',
                icon: <ApartmentOutlined />,
                label: <Link to="/roles/hierarchy">Role Hierarchy</Link>
              }
            ]
          },
          {
            key: 'permissions',
            icon: <SafetyCertificateOutlined />,
            label: <Link to="/permissions">Permissions</Link>
          }
        ]
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: <a onClick={handleLogout} href="#">Logout</a>,
        className: 'ml-auto'
      }
    ] : [
      {
        key: 'login',
        icon: <LoginOutlined />,
        label: <Link to="/login">Login</Link>,
        className: 'ml-auto'
      }
    ])
  ];

  // Get the current selected key based on the path
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/') return ['home'];
    if (path === '/roles/hierarchy') return ['role-hierarchy'];
    return [path.split('/')[1]];
  };

  // Get the open submenu keys based on the selected key
  const getOpenKeys = () => {
    const selectedKeys = getSelectedKeys();
    if (selectedKeys.includes('users') || selectedKeys.includes('roles') || selectedKeys.includes('permissions')) {
      return ['management'];
    }
    if (selectedKeys.includes('role-hierarchy')) {
      return ['management', 'roles'];
    }
    return [];
  };

  return (
    <Menu 
      mode="horizontal" 
      items={items}
      selectedKeys={getSelectedKeys()}
      defaultOpenKeys={getOpenKeys()}
      className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
      theme={isDarkMode ? 'dark' : 'light'}
      style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}
    />
  );
};

export default Navigation;
