import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, message, Space, Modal, Form } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/api';
import { debounce } from '../../utils/debounce';
import Button from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const debouncedSearch = debounce((value: string) => {
    // Implement search logic here
    console.log('Searching for:', value);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const showModal = (user?: User) => {
    if (user) {
      setEditingUserId(user.id);
      form.setFieldsValue(user);
    } else {
      setEditingUserId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUserId) {
        await updateUser(editingUserId, values);
        message.success('User updated successfully');
      } else {
        await createUser(values);
        message.success('User created successfully');
      }
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('Failed to save user');
    }
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
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: User) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={`p-4 sm:p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <Input.Search
          placeholder="Search users"
          value={searchTerm}
          onChange={handleSearch}
          className={`w-full sm:w-64 mb-4 sm:mb-0 ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
        />
        <Button
          variant="primary"
          icon={<UserAddOutlined />}
          onClick={() => showModal()}
          className="w-full sm:w-auto"
        >
          Add User
        </Button>
      </div>
      <Table<User>
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          total: users.length,
          pageSize: 10,
          showSizeChanger: false,
        }}
        scroll={{ x: 'max-content' }}
        className={isDarkMode ? 'ant-table-dark' : ''}
      />
      <Modal
        title={editingUserId ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width="95%"
        style={{ maxWidth: '500px' }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
