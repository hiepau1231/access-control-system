import React from 'react';
import RoleManagement from '../../components/role/RoleManagement';
import { Card } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const RoleManagementPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Role Management
        </h1>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage system roles and their associated permissions. Roles define what actions users can perform in the system.
        </p>
      </div>
      
      <Card 
        bordered={false}
        className={`shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <RoleManagement />
      </Card>

      {/* Help section */}
      <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          About Roles and Permissions
        </h2>
        <ul className={`list-disc pl-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <li className="mb-2">
            <strong>Roles</strong> are collections of permissions that can be assigned to users.
          </li>
          <li className="mb-2">
            Each role can have multiple permissions, and users can be assigned one or more roles.
          </li>
          <li className="mb-2">
            Use the <strong>Permissions</strong> button to manage what actions each role can perform.
          </li>
          <li>
            Be careful when deleting roles - ensure no users are dependent on the role first.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RoleManagementPage;