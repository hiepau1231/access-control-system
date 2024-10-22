import React, { useState, useEffect, useCallback } from 'react';
import { Table, Space, Button, Modal, Form, Input, Select, message } from 'antd';
import { getUsers, updateUser, deleteUser, getRoles } from '../../services/api';

const { Option } = Select;
const { Search } = Input;

const UserManagement: React.FC = React.memo(() => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<Array<{ id: string, name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
      setPagination(prev => ({ ...prev, total: Array.isArray(response.data) ? response.data.length : 0 }));
    } catch (error) {
      message.error('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const memoizedFetchUsers = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    memoizedFetchUsers();
    fetchRoles();
  }, [memoizedFetchUsers]);

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách vai trò. Vui lòng thử lại sau.');
      console.error('Error fetching roles:', error);
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
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      message.error('Không thể xóa người dùng. Vui lòng thử lại sau.');
      console.error('Error deleting user:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUserId) {
        await updateUser(editingUserId, values);
        message.success('Cập nhật người dùng thành công');
      }
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Không thể cập nhật người dùng: ${error.message}`);
      } else {
        message.error('Không thể cập nhật người dùng. Vui lòng thử lại sau.');
      }
      console.error('Error updating user:', error);
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

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  return (
    <div>
      <Search
        placeholder="Tìm kiếm người dùng"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={Array.isArray(users) ? users : []}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
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
});

export default UserManagement;
