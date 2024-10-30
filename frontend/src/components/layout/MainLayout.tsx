import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import { Navigation } from '../common/Navigation';
import { useTheme } from '../../contexts/ThemeContext';

const { Header, Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <Layout className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Header className={`fixed w-full z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Navigation />
      </Header>
      
      <Content className="mt-16 p-6">
        <div className={`
          site-layout-background 
          p-6 
          rounded-lg 
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}
        `}>
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default MainLayout;
