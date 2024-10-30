import React from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading }) => {
  const [form] = Form.useForm();
  const { isDarkMode } = useTheme();

  const onFinish = async (values: any) => {
    await onLogin(values.username, values.password);
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
      className="w-full"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input
          prefix={<UserOutlined className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />}
          placeholder="Username"
          size="large"
          className={`rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password
          prefix={<LockOutlined className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />}
          placeholder="Password"
          size="large"
          className={`rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="w-full rounded-lg h-12 font-medium"
          loading={loading}
        >
          Sign In
        </Button>
      </Form.Item>

      <div className="text-center">
        <Link 
          to="/forgot-password"
          className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
        >
          Forgot password?
        </Link>
      </div>

      <Divider className={isDarkMode ? 'border-gray-600' : ''}>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Or
        </span>
      </Divider>

      <div className="text-center">
        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Don't have an account?{' '}
        </span>
        <Link 
          to="/register"
          className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
        >
          Sign up now
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
