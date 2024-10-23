import React from 'react';
import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { SaveOutlined } from '@ant-design/icons';

const { Option } = Select;

const SettingsPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const onFinish = (values: any) => {
    console.log('Settings saved:', values);
    message.success('Settings saved successfully');
    // Implement the logic to save settings
  };

  return (
    <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Settings</h1>
      <Form
        name="settings"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          siteName: 'My RBAC System',
          defaultLanguage: 'en',
          itemsPerPage: 10,
          sessionTimeout: 30
        }}
        className="space-y-6"
      >
        <Form.Item
          label={<span className="text-lg">Site Name</span>}
          name="siteName"
          rules={[{ required: true, message: 'Please input the site name!' }]}
        >
          <Input 
            className={`rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} hover:border-blue-500 focus:border-blue-500 transition-colors duration-300`} 
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-lg">Default Language</span>}
          name="defaultLanguage"
          rules={[{ required: true, message: 'Please select the default language!' }]}
        >
          <Select 
            className={`w-full ${isDarkMode ? 'ant-select-dark' : ''}`}
            size="large"
          >
            <Option value="en">English</Option>
            <Option value="es">Spanish</Option>
            <Option value="fr">French</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="text-lg">Items Per Page</span>}
          name="itemsPerPage"
          rules={[{ required: true, message: 'Please input the number of items per page!' }]}
        >
          <InputNumber 
            min={1} 
            max={100} 
            className={`w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'}`} 
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-lg">Session Timeout (minutes)</span>}
          name="sessionTimeout"
          rules={[{ required: true, message: 'Please input the session timeout!' }]}
        >
          <InputNumber 
            min={5} 
            max={120} 
            className={`w-full rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'}`} 
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
            className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md transition-colors duration-300 flex items-center justify-center`}
          >
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SettingsPage;
