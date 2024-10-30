import React from 'react';
import UserManagement from '../../components/user/UserManagement';
import { Card } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const UserManagementPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          User Management
        </h1>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage system users, their roles, and permissions
        </p>
      </div>
      
      <Card 
        bordered={false}
        className={`shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <UserManagement />
      </Card>
    </div>
  );
};

export default UserManagementPage;