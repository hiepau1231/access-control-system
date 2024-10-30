import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useAuth } from '../../hooks';

export const Navigation = (): JSX.Element => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  const items: MenuProps['items'] = [
    {
      key: 'home',
      label: <Link to="/">Home</Link>
    },
    ...(isAuthenticated ? [
      {
        key: 'users',
        label: <Link to="/users">Users</Link>
      },
      {
        key: 'roles',
        label: <Link to="/roles">Roles</Link>
      },
      {
        key: 'permissions',
        label: <Link to="/permissions">Permissions</Link>
      },
      {
        key: 'logout',
        label: <a onClick={handleLogout} href="#">Logout</a>
      }
    ] : [
      {
        key: 'login',
        label: <Link to="/login">Login</Link>
      }
    ])
  ];

  return <Menu mode="horizontal" items={items} />;
};

