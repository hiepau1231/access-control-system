import React from 'react';
import { Layout, Menu, Timeline } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import type { TimelineItemProps } from 'antd';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useTheme();

  const activityItems: TimelineItemProps[] = [
    {
      children: 'Recent login',
      color: 'green',
      key: '1'
    },
    {
      children: 'System update',
      color: 'blue',
      key: '2'
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className={isDarkMode ? 'bg-gray-800' : ''}>
        {/* Header content */}
      </Header>
      <Layout>
        <Sider className={isDarkMode ? 'bg-gray-700' : ''}>
          {/* Sidebar content */}
        </Sider>
        <Layout>
          <Content className="p-6">
            {children}
          </Content>
          <div className="p-4">
            <Timeline 
              items={activityItems}
            />
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 