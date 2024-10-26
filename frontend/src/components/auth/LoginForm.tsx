import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [form] = Form.useForm();

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
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Login
        </Button>
      </Form.Item>

      <div className="text-center">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </Form>
  );
};

export default LoginForm;
