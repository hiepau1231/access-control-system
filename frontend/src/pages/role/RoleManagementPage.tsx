import React from 'react';
import { Table, Button } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const RoleManagementPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
      name: 'Admin',
      description: 'Full access to all features',
    },
    // Add more mock data as needed
  ];

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Role Management</h1>
      <Table 
        columns={columns} 
        dataSource={data} 
        className={isDarkMode ? 'ant-table-dark' : ''}
      />
    </div>
  );
};

export default RoleManagementPage;
