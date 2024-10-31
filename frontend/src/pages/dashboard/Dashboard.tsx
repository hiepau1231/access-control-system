import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Timeline, List, Badge, Avatar, Alert } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { getUsers, getRoles, getPermissions } from '../../services/api';
import {
  TeamOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  BellOutlined
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    permissions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, roles, permissions] = await Promise.all([
          getUsers(),
          getRoles(),
          getPermissions()
        ]);
        setStats({
          users: users.length,
          roles: roles.length,
          permissions: permissions.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Mock data for recent activities
  const recentActivities = [
    { user: 'Admin', action: 'đã thêm quyền mới', time: '2 phút trước', type: 'success' },
    { user: 'Manager', action: 'đã cập nhật vai trò', time: '5 phút trước', type: 'info' },
    { user: 'User1', action: 'đã đăng nhập', time: '10 phút trước', type: 'success' },
    { user: 'System', action: 'backup dữ liệu tự động', time: '30 phút trước', type: 'warning' }
  ];

  // Mock data for online users
  const onlineUsers = [
    { name: 'Admin', status: 'online', avatar: 'A', lastActive: 'Hiện tại' },
    { name: 'Manager', status: 'away', avatar: 'M', lastActive: '5 phút trước' },
    { name: 'User1', status: 'online', avatar: 'U', lastActive: 'Hiện tại' }
  ];

  // Mock data for system notifications
  const notifications = [
    { type: 'success', message: 'Backup dữ liệu thành công' },
    { type: 'info', message: 'Cập nhật hệ thống mới khả dụng' },
    { type: 'warning', message: 'Đã phát hiện 2 lần đăng nhập thất bại' }
  ];

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Tổng quan hệ thống
        </h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          Xin chào, {user?.username}!
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card 
            bordered={false}
            className={`shadow-sm hover:shadow-md transition-shadow ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
            }`}
          >
            <Statistic
              title={<span className={`text-lg ${isDarkMode ? 'text-gray-300' : ''}`}>Người dùng</span>}
              value={stats.users}
              prefix={<TeamOutlined className="text-blue-500" />}
              loading={loading}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            bordered={false}
            className={`shadow-sm hover:shadow-md transition-shadow ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
            }`}
          >
            <Statistic
              title={<span className={`text-lg ${isDarkMode ? 'text-gray-300' : ''}`}>Vai trò</span>}
              value={stats.roles}
              prefix={<SafetyCertificateOutlined className="text-green-500" />}
              loading={loading}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            bordered={false}
            className={`shadow-sm hover:shadow-md transition-shadow ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
            }`}
          >
            <Statistic
              title={<span className={`text-lg ${isDarkMode ? 'text-gray-300' : ''}`}>Quyền hạn</span>}
              value={stats.permissions}
              prefix={<LockOutlined className="text-purple-500" />}
              loading={loading}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Activity and Info Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>
                Hoạt động gần đây
              </span>
            }
            bordered={false}
            className={`shadow-sm hover:shadow-md transition-shadow ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
            }`}
          >
            <Timeline>
              {recentActivities.map((activity, index) => (
                <Timeline.Item 
                  key={index}
                  color={activity.type === 'success' ? 'green' : activity.type === 'info' ? 'blue' : 'orange'}
                  dot={activity.type === 'success' ? <CheckCircleOutlined /> : 
                       activity.type === 'info' ? <SyncOutlined spin /> : 
                       <ClockCircleOutlined />}
                >
                  <p className={`mb-0 font-medium ${isDarkMode ? 'text-white' : ''}`}>
                    {activity.user} {activity.action}
                  </p>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {activity.time}
                  </p>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Card 
                title={
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>
                    Người dùng trực tuyến
                  </span>
                }
                bordered={false}
                className={`shadow-sm hover:shadow-md transition-shadow ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
                }`}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={onlineUsers}
                  renderItem={user => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Badge 
                            status={user.status === 'online' ? 'success' : 'warning'} 
                            offset={[-2, 32]}
                          >
                            <Avatar style={{ 
                              backgroundColor: user.status === 'online' ? '#52c41a' : '#faad14',
                              color: 'white'
                            }}>
                              {user.avatar}
                            </Avatar>
                          </Badge>
                        }
                        title={
                          <span className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>
                            {user.name}
                          </span>
                        }
                        description={
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {user.lastActive}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col span={24}>
              <Card 
                title={
                  <div className="flex items-center">
                    <BellOutlined className={`mr-2 ${isDarkMode ? 'text-white' : ''}`} />
                    <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>
                      Thông báo hệ thống
                    </span>
                  </div>
                }
                bordered={false}
                className={`shadow-sm hover:shadow-md transition-shadow ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
                }`}
              >
                {notifications.map((notification, index) => (
                  <Alert
                    key={index}
                    message={notification.message}
                    type={notification.type as any}
                    showIcon
                    className="mb-2"
                  />
                ))}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;