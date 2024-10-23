import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Users"
              value={112893}
              prefix={<UserOutlined className="text-blue-500" />}
              className="text-center"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Roles"
              value={9}
              prefix={<TeamOutlined className="text-green-500" />}
              className="text-center"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <Statistic
              title="Total Permissions"
              value={36}
              prefix={<LockOutlined className="text-purple-500" />}
              className="text-center"
            />
          </Card>
        </Col>
      </Row>
      {/* Add more dashboard content here */}
    </div>
  );
};

export default DashboardPage;
