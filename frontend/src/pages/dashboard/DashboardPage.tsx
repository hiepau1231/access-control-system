import React from 'react';
import { Card, Row, Col } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="Users" className={isDarkMode ? 'bg-gray-700 text-white' : ''}>
            <p>Total Users: 100</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Roles" className={isDarkMode ? 'bg-gray-700 text-white' : ''}>
            <p>Total Roles: 5</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Permissions" className={isDarkMode ? 'bg-gray-700 text-white' : ''}>
            <p>Total Permissions: 20</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
