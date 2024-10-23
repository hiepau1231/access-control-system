import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { forgotPassword } from '../../services/auth';

const ForgotPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      message.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      message.error('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form name="forgot_password" onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ForgotPasswordForm;
