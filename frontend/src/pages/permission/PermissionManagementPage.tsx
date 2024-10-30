import React from 'react';
import PermissionManagement from '../../components/permission/PermissionManagement';
import { Card, Alert } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { InfoCircleOutlined } from '@ant-design/icons';

const PermissionManagementPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Permission Management
        </h1>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage system permissions that control access to various features and functionalities.
        </p>
      </div>

      {/* Info Alert */}
      <Alert
        message="Permission Management Guidelines"
        description={
          <ul className="list-disc pl-4 mt-2">
            <li>Use clear, descriptive names for permissions</li>
            <li>Group related permissions into categories</li>
            <li>Ensure descriptions clearly explain the granted access</li>
            <li>Review existing permissions before creating new ones</li>
          </ul>
        }
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        className="mb-6"
      />
      
      <Card 
        bordered={false}
        className={`shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <PermissionManagement />
      </Card>

      {/* Help section */}
      <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Understanding Permissions
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <div>
            <h3 className="font-medium mb-1">Permission Categories</h3>
            <ul className="list-disc pl-5">
              <li><strong>User Management:</strong> Control user-related operations</li>
              <li><strong>Role Management:</strong> Manage role definitions and assignments</li>
              <li><strong>Permission Management:</strong> Control over permission system</li>
              <li><strong>Content Management:</strong> Content creation and modification</li>
              <li><strong>System Settings:</strong> System configuration access</li>
              <li><strong>Reporting:</strong> Access to various reports</li>
              <li><strong>Audit Logs:</strong> Access to system audit information</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Best Practices</h3>
            <ul className="list-disc pl-5">
              <li>Follow the principle of least privilege</li>
              <li>Regularly review and audit permissions</li>
              <li>Use descriptive names and clear descriptions</li>
              <li>Consider the impact before deleting permissions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManagementPage;