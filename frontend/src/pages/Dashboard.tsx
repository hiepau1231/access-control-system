import React from 'react';
import { Card, Col, Row, Timeline } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import type { TimelineItemProps } from 'antd';

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();

  const timelineItems: TimelineItemProps[] = [
    {
      children: 'System initialized',
      color: 'green',
      key: '1'
    },
    {
      children: 'User management setup completed',
      color: 'blue',
      key: '2'
    },
    {
      children: 'Role-based access control implemented',
      color: 'blue',
      key: '3'
    },
    {
      children: 'Password encryption feature added',
      color: 'blue',
      key: '4'
    }
  ];

  return (
    <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Activities" 
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          >
            <Timeline items={timelineItems} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="System Status" 
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          >
            <p>All systems operational</p>
            <p>Database connected</p>
            <p>Authentication services running</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 