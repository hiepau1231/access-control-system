import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { MenuProps } from 'antd';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    hasPermission('read:users') && {
      key: 'users',
      label: <Link to="/users">User Management</Link>,
    },
    hasPermission('read:roles') && {
      key: 'roles',
      label: <Link to="/roles">Role Management</Link>,
    },
    hasPermission('read:permissions') && {
      key: 'permissions',
      label: <Link to="/permissions">Permission Management</Link>,
    },
  ].filter(Boolean);

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
      items={menuItems}
      className="border-b"
    />
  );
};

