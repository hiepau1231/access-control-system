import React from 'react';
import { Table, Button } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const UserManagementPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="primary">Edit</Button>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'Admin',
    },
    // Add more mock data as needed
  ];

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>User Management</h1>
      <Table 
        columns={columns} 
        dataSource={data} 
        className={isDarkMode ? 'ant-table-dark' : ''}
      />
    </div>
  );
};

export default UserManagementPage;
