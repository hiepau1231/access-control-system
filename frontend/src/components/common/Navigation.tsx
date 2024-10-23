import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DashboardOutlined, 
  UserOutlined, 
  TeamOutlined, 
  KeyOutlined, 
  SettingOutlined,
  LogoutOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';

const { Sider } = Layout;

interface NavigationProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      className={`fixed left-0 top-0 bottom-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="logo p-4">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Logo</h2>
      </div>
      <Menu
        theme={isDarkMode ? 'dark' : 'light'}
        mode="inline"
        defaultSelectedKeys={['1']}
      >
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/users">Users</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<TeamOutlined />}>
          <Link to="/roles">Roles</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<KeyOutlined />}>
          <Link to="/permissions">Permissions</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<SettingOutlined />}>
          <Link to="/settings">Settings</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
        <Menu.Item 
          key="7" 
          icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
          onClick={toggleDarkMode}
          className="mt-auto"
        >
          <div className="flex items-center justify-between">
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            <div 
              className={`w-10 h-5 flex items-center ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'} rounded-full p-1 duration-300 ease-in-out`}
              onClick={toggleDarkMode}
            >
              <div 
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-5' : ''}`}
              ></div>
            </div>
          </div>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Navigation;
