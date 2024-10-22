import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, Select, message } from 'antd';
import { getUsers, updateUser, deleteUser, getRoles } from '../../services/api';

const { Option } = Select;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState<Array<{ id: string, name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to fetch roles');
    }
  };

  const handleEdit = (record: any) => {
    setEditingUserId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUserId) {
        await updateUser(editingUserId, values);
        message.success('User updated successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId: string) => {
        const role = roles.find((r: any) => r.id === roleId);
        return role ? role.name : 'N/A';
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={users} rowKey="id" loading={loading} />
      <Modal
        title="Edit User"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input the username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="roleId" label="Role" rules={[{ required: true, message: 'Please select a role!' }]}>
            <Select>
              {roles.map((role: any) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
