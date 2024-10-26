import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      navigate(key);
    }
  };

  const menuItems = [
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: '/roles',
      icon: <LockOutlined />,
      label: 'Roles',
    },
    {
      key: '/permissions',
      icon: <SafetyCertificateOutlined />,
      label: 'Permissions',
    },
    {
      key: '/roles/hierarchy',
      icon: <TeamOutlined />,
      label: 'Role Hierarchy',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className={isDarkMode ? 'bg-gray-800' : 'bg-white'}
        theme={isDarkMode ? 'dark' : 'light'}
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 10
        }}
      >
        <div className={`
          flex items-center justify-center h-16 
          ${isDarkMode ? 'bg-gray-900' : 'bg-white'} 
          border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <h1 className={`
            text-lg font-bold transition-all duration-300
            ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
            ${isDarkMode ? 'text-white' : 'text-gray-800'}
          `}>
            Admin Panel
          </h1>
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          className={isDarkMode ? 'bg-gray-800' : 'bg-white'}
        />
      </Sider>
      <Layout>
        <Header 
          className={`
            px-4 flex items-center
            ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
            border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}
          style={{ 
            padding: '0 16px',
            height: 64,
            lineHeight: '64px',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)'
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: `text-xl cursor-pointer transition-colors
                ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
              `,
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content 
          className={`
            m-4 p-4 rounded-lg
            ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}
          `}
          style={{
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
