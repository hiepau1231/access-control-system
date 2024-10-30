import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { MenuProps } from 'antd';

interface CustomMenuItem {
  key: string;
  label: JSX.Element;
}

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  const menuItems = [
    {
      key: 'dashboard',
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    hasPermission('read:users') ? {
      key: 'users',
      label: <Link to="/users">User Management</Link>,
    } : null,
    hasPermission('read:roles') ? {
      key: 'roles',
      label: <Link to="/roles">Role Management</Link>,
    } : null,
    hasPermission('read:permissions') ? {
      key: 'permissions',
      label: <Link to="/permissions">Permission Management</Link>,
    } : null,
  ].filter((item): item is CustomMenuItem => item !== null);

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
      items={menuItems}
      className="border-b"
    />
  );
};

