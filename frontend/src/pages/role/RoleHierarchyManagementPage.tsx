import React from 'react';
import RoleHierarchyManagement from '../../components/role/RoleHierarchyManagement';
import RoleHierarchyErrorBoundary from '../../components/role/RoleHierarchyErrorBoundary';
import { Card, Alert, Typography } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  ApartmentOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { errorReporting } from '../../utils/errorReporting';

const { Title, Paragraph } = Typography;

const RoleHierarchyManagementPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const handleError = (error: Error) => {
    errorReporting.logError({
      error,
      context: {
        page: 'RoleHierarchyManagementPage',
        feature: 'Role Hierarchy',
        action: 'Page Load/Interaction'
      }
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ApartmentOutlined className="text-2xl" />
          <Title level={2} className={`m-0 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Role Hierarchy Management
          </Title>
        </div>
        <Paragraph className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage and visualize the hierarchical relationships between roles in the system.
          Define parent-child relationships and control permission inheritance.
        </Paragraph>
      </div>

      {/* Important Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Alert
          message="Permission Inheritance"
          description="Child roles automatically inherit all permissions from their parent roles. This creates a cascading effect of permissions through the hierarchy."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />
        <Alert
          message="Important Considerations"
          description="Changes to role hierarchy affect all users with the modified roles. Review carefully before making changes."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
        />
      </div>
      
      {/* Main Content with Error Boundary */}
      <RoleHierarchyErrorBoundary>
        <Card 
          bordered={false}
          className={`shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <RoleHierarchyManagement onError={handleError} />
        </Card>
      </RoleHierarchyErrorBoundary>

      {/* Documentation Section */}
      <div className={`mt-6 p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <Title level={3} className={isDarkMode ? 'text-white' : 'text-gray-800'}>
          Understanding Role Hierarchy
        </Title>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <Title level={4} className={isDarkMode ? 'text-white' : 'text-gray-800'}>
              Key Concepts
            </Title>
            <ul className={`list-disc pl-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li className="mb-2">
                <strong>Inheritance:</strong> Child roles inherit all permissions from their parent roles
              </li>
              <li className="mb-2">
                <strong>Multiple Parents:</strong> A role can have multiple parent roles
              </li>
              <li className="mb-2">
                <strong>Multiple Children:</strong> A role can have multiple child roles
              </li>
              <li className="mb-2">
                <strong>Circular Prevention:</strong> System prevents circular dependencies
              </li>
            </ul>
          </div>

          <div>
            <Title level={4} className={isDarkMode ? 'text-white' : 'text-gray-800'}>
              Best Practices
            </Title>
            <ul className={`list-disc pl-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li className="mb-2">
                Keep the hierarchy as simple as possible
              </li>
              <li className="mb-2">
                Review inheritance paths before making changes
              </li>
              <li className="mb-2">
                Document role relationships and their purpose
              </li>
              <li className="mb-2">
                Regularly audit role hierarchies
              </li>
            </ul>
          </div>
        </div>

        <Alert
          message="Need Help?"
          description="If you're unsure about making changes to role hierarchy, consult with your system administrator or security team. Changes to role hierarchy can have significant impact on system access."
          type="info"
          showIcon
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default RoleHierarchyManagementPage;