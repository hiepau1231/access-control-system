import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MainLayout } from './components/layout/MainLayout';
import { ConfigProvider, theme, App as AntApp } from 'antd';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ConfigProvider
            theme={{
              algorithm: theme.defaultAlgorithm,
            }}
          >
            <AntApp>
              <MainLayout />
            </AntApp>
          </ConfigProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
