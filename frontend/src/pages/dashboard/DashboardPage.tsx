import React from 'react';
import { Card, Row, Col } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { UserOutlined, TeamOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const DashboardPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const cardStyle = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-gray-200'
    : 'bg-white border-gray-200 text-gray-800';

  const iconStyle = `text-4xl ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`;

  return (
    <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Dashboard</h1>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card 
            title={
              <span className="flex items-center text-lg font-semibold">
                <UserOutlined className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                Users
              </span>
            }
            className={`h-full ${cardStyle} hover:shadow-md transition-shadow duration-300`}
            bodyStyle={{ padding: '24px' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">100</span>
              <UserOutlined className={iconStyle} />
            </div>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card 
            title={
              <span className="flex items-center text-lg font-semibold">
                <TeamOutlined className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                Roles
              </span>
            }
            className={`h-full ${cardStyle} hover:shadow-md transition-shadow duration-300`}
            bodyStyle={{ padding: '24px' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">5</span>
              <TeamOutlined className={iconStyle} />
            </div>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Roles</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card 
            title={
              <span className="flex items-center text-lg font-semibold">
                <SafetyCertificateOutlined className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                Permissions
              </span>
            }
            className={`h-full ${cardStyle} hover:shadow-md transition-shadow duration-300`}
            bodyStyle={{ padding: '24px' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">20</span>
              <SafetyCertificateOutlined className={iconStyle} />
            </div>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Permissions</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;