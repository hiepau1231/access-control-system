import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';

interface RegisterFormProps {
  onRegister: (username: string, email: string, password: string) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      await onRegister(values.username, values.email, values.password);
    } catch (error) {
      console.error('Registration error details:', error);
    }
  };

  return (
    <Form
      form={form}
      name="register"
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
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 6, message: 'Password must be at least 6 characters!' }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Register
        </Button>
      </Form.Item>

      <div className="text-center">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </Form>
  );
};

export default RegisterForm;
