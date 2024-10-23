import React from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h1>
      <Form
        name="settings"
        onFinish={onFinish}
        layout="vertical"
        className={isDarkMode ? 'text-white' : ''}
      >
        <Form.Item
          label="Site Name"
          name="siteName"
          rules={[{ required: true, message: 'Please input the site name!' }]}
        >
          <Input className={isDarkMode ? 'bg-gray-700 text-white' : ''} />
        </Form.Item>

        <Form.Item label="Dark Mode">
          <Switch checked={isDarkMode} onChange={toggleDarkMode} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SettingsPage;
