import React from 'react';
import { Result, Button, Typography } from 'antd';
import { 
  ReloadOutlined, 
  RollbackOutlined,
  WarningOutlined 
} from '@ant-design/icons';
import ErrorBoundary from '../common/ErrorBoundary';
import { useNavigate } from 'react-router-dom';

const { Paragraph, Text } = Typography;

interface FallbackProps {
  error: Error | null;
  resetError: () => void;
}

const RoleHierarchyError: React.FC<FallbackProps> = ({ error, resetError }) => {
  const navigate = useNavigate();

  const handleBackToRoles = () => {
    navigate('/roles');
  };

  // Common role hierarchy errors and their user-friendly messages
  const getErrorMessage = (error: Error | null) => {
    if (!error) {
      return {
        title: 'Unknown Error',
        subTitle: 'An unknown error occurred.',
        solution: 'Please try again or contact support.'
      };
    }

    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('circular')) {
      return {
        title: 'Circular Dependency Detected',
        subTitle: 'The requested change would create a circular relationship between roles.',
        solution: 'Review the role hierarchy and ensure there are no circular dependencies.'
      };
    }
    
    if (errorMessage.includes('permission')) {
      return {
        title: 'Permission Error',
        subTitle: 'You don\'t have sufficient permissions to perform this action.',
        solution: 'Contact your administrator for the necessary permissions.'
      };
    }
    
    if (errorMessage.includes('not found')) {
      return {
        title: 'Role Not Found',
        subTitle: 'The requested role could not be found.',
        solution: 'The role might have been deleted. Try refreshing the page.'
      };
    }

    // Default error message
    return {
      title: 'Role Hierarchy Error',
      subTitle: 'An error occurred while managing role hierarchy.',
      solution: 'Try again or contact support if the problem persists.'
    };
  };

  const errorDetails = getErrorMessage(error);

  return (
    <Result
      status="error"
      icon={<WarningOutlined className="text-red-500" />}
      title={errorDetails.title}
      subTitle={
        <div className="text-left mt-4">
          <Paragraph>
            <Text strong>{errorDetails.subTitle}</Text>
          </Paragraph>
          <Paragraph type="secondary">
            Suggested Solution: {errorDetails.solution}
          </Paragraph>
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mt-4">
              <details className="cursor-pointer">
                <summary className="text-blue-500 hover:text-blue-700">
                  Technical Details
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-48">
                  <code>{error.toString()}</code>
                </pre>
              </details>
            </div>
          )}
        </div>
      }
      extra={[
        <Button
          key="retry"
          type="primary"
          icon={<ReloadOutlined />}
          onClick={resetError}
        >
          Try Again
        </Button>,
        <Button
          key="back"
          icon={<RollbackOutlined />}
          onClick={handleBackToRoles}
        >
          Back to Roles
        </Button>
      ]}
    />
  );
};

// Specialized Error Boundary for Role Hierarchy
const RoleHierarchyErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={RoleHierarchyError}
      onError={(error, errorInfo) => {
        // Log to error reporting service
        console.error('Role Hierarchy Error:', error);
        console.error('Error Info:', errorInfo);
        
        // You could add additional error reporting here
        // e.g., sending to a monitoring service
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default RoleHierarchyErrorBoundary;
