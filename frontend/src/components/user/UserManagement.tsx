import React, { useState, useCallback, useEffect } from 'react';
import { Table, Input, message, Space, Modal, Form, Select } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getUsers, createUser, updateUser, deleteUser, getRoles } from '../../services/api';
import { debounce } from '../../utils/debounce';
import { Button } from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import type { User, Role } from '../../services/api';
import PasswordViewModal from './PasswordViewModal';

const { confirm } = Modal;

const UserManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedPassword, setSelectedPassword] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);
    } catch (error) {
      message.error('Failed to fetch roles');
    }
  }, []);

  // Fetch users and roles when component mounts
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const debouncedSearch = debounce((value: string) => {
    const filteredUsers = users.filter(user => 
      user.username.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setUsers(filteredUsers);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      fetchUsers(); // Reset to original list if search is cleared
    } else {
      debouncedSearch(value);
    }
  };

  const showModal = (user?: User) => {
    if (user) {
      setEditingUserId(user.id);
      form.setFieldsValue({
        ...user,
        password: undefined // Don't show password in edit mode
      });
    } else {
      setEditingUserId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUserId) {
        // Don't send password and secretKey if it's empty in edit mode
        const { password, secretKey, ...updateData } = values;
        if (password) {
          updateData.password = password;
        }
        await updateUser(editingUserId, updateData);
        message.success('User updated successfully');
      } else {
        // Include secretKey when creating new user
        await createUser(values);
        message.success('User created successfully');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      message.error('Failed to save user');
    }
  };

  const showDeleteConfirm = (id: string, username: string) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      content: `User: ${username}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteUser(id);
          message.success('User deleted successfully');
          fetchUsers();
        } catch (error) {
          message.error('Failed to delete user');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a: User, b: User) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId: string) => {
        const role = roles.find(r => r.id === roleId);
        return role?.name || roleId;
      },
    },
    {
      title: 'Password',
      dataIndex: 'encryptedPassword',
      key: 'password',
      render: (encryptedPassword: string) => (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">Dữ liệu mã hóa:</span>
            <span className="font-mono text-sm bg-gray-100 p-1 px-2 rounded">
              {encryptedPassword}
            </span>
          </div>
          <Button
            variant="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedPassword(encryptedPassword);
              setModalVisible(true);
            }}
          />
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: string, record: User) => (
        <Space size="middle">
          <Button
            variant="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id, record.username)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const passwordRules = editingUserId
    ? [{ min: 8, message: 'Password must be at least 8 characters' }] // Optional in edit mode
    : [
        { required: true, message: 'Please input a password!' },
        { min: 8, message: 'Password must be at least 8 characters' },
        {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          message: 'Password must contain uppercase, lowercase, number and special character'
        }
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
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
        }}
        scroll={{ x: 'max-content' }}
        className={isDarkMode ? 'ant-table-dark' : ''}
      />
      <Modal
        title={editingUserId ? "Edit User" : "Add User"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width="95%"
        style={{ maxWidth: '500px' }}
        closeIcon={
          <span className="text-gray-400 hover:text-gray-600 text-xl">×</span>
        }
        className="custom-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="username" 
            label="Username"
            rules={[
              { required: true, message: 'Please input username!' },
              { min: 3, message: 'Username must be at least 3 characters' },
              { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Username can only contain letters, numbers, underscores and hyphens' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="email" 
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={editingUserId ? "Password (leave blank to keep unchanged)" : "Password"}
            rules={passwordRules}
          >
            <Input.Password />
          </Form.Item>
          {!editingUserId && (
            <Form.Item
              name="secretKey"
              label="Encryption Key"
              tooltip="This key will be required to view the password later"
              rules={[
                { required: true, message: 'Please input encryption key!' },
                { min: 6, message: 'Encryption key must be at least 6 characters' }
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item 
            name="roleId" 
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <PasswordViewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        encryptedPassword={selectedPassword}
      />
    </div>
  );
};

export default UserManagement;