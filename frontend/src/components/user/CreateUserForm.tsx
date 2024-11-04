import { Form, Input, Select, Button, message } from 'antd';
import { useState } from 'react';

interface CreateUserFormValues {
  username: string;
  email: string;
  password: string;
  secretKey: string;
  role: 'admin' | 'user';
}

const CreateUserForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: CreateUserFormValues) => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (data.success) {
        message.success('User created successfully');
        form.resetFields();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input placeholder="Username" />
      </Form.Item>

      <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item 
        name="secretKey" 
        rules={[{ required: true }]}
        tooltip="This key will be required to view the password later"
      >
        <Input.Password placeholder="Encryption Key" />
      </Form.Item>

      <Form.Item name="role" rules={[{ required: true }]}>
        <Select placeholder="Select role">
          <Select.Option value="admin">Admin</Select.Option>
          <Select.Option value="user">User</Select.Option>
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        Create User
      </Button>
    </Form>
  );
};

export default CreateUserForm; 