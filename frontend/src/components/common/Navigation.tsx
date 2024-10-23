import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Drawer } from 'antd';
import { 
  MenuOutlined,
  DashboardOutlined, 
  UserOutlined, 
  TeamOutlined, 
  LockOutlined, 
  SettingOutlined, 
  LogoutOutlined, 
  BulbOutlined 
} from '@ant-design/icons';
import { logout } from '../../services/auth';
import Button from './Button';

interface NavigationProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const items = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/' },
    { key: 'users', icon: <UserOutlined />, label: 'Users', path: '/users' },
    { key: 'roles', icon: <TeamOutlined />, label: 'Roles', path: '/roles' },
    { key: 'permissions', icon: <LockOutlined />, label: 'Permissions', path: '/permissions' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings', path: '/settings' },
  ];

  const NavContent = () => (
    <>
      <div className="p-4">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Logo</h2>
      </div>
      <ul className="mt-8">
        {items.map((item) => (
          <li key={item.key} className="mb-2">
            <Link
              to={item.path}
              className={`flex items-center px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setIsDrawerVisible(false)}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          </li>
        ))}
        <li className="mb-2">
          <a
            onClick={() => { logout(); setIsDrawerVisible(false); }}
            className={`flex items-center px-4 py-2 cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LogoutOutlined />
            <span className="ml-2">Logout</span>
          </a>
        </li>
      </ul>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Switch
          checkedChildren={<BulbOutlined />}
          unCheckedChildren={<BulbOutlined />}
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
      </div>
    </>
  );

  return (
    <>
      <nav className={`hidden lg:block h-screen w-64 fixed left-0 top-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <NavContent />
      </nav>
      <div className="lg:hidden">
        <Button
          variant="secondary"
          icon={<MenuOutlined />}
          onClick={() => setIsDrawerVisible(true)}
          className="fixed top-4 left-4 z-20"
        >
          Menu
        </Button>
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setIsDrawerVisible(false)}
          visible={isDrawerVisible}
          bodyStyle={{ padding: 0 }}
          width={250}
        >
          <NavContent />
        </Drawer>
      </div>
    </>
  );
};

export default Navigation;
