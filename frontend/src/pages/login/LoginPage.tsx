import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import Button from '../../components/common/Button';
import { useTheme } from '../../contexts/ThemeContext';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await login(values.username, values.password);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        message.success('Đăng nhập thành công');
        navigate('/dashboard');
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Đăng nhập
          </h2>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="mt-8 space-y-6"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined className={isDarkMode ? 'text-gray-300' : 'text-gray-400'} />} 
              placeholder="Tên đăng nhập" 
              className={`rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`} 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined className={isDarkMode ? 'text-gray-300' : 'text-gray-400'} />} 
              placeholder="Mật khẩu" 
              className={`rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`} 
            />
          </Form.Item>
          <Form.Item>
            <Button
              variant="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
