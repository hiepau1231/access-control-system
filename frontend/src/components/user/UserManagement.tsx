import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getUsers, getRoles, deleteUser } from '../../services/api';
import { handleError, showSuccess } from '../../utils/errorHandler';
import { debounce } from '../../utils/debounce';

const { Search } = Input;

interface User {
  id: string;
  username: string;
  email: string;
  roleId: string;
}

interface Role {
  id: string;
  name: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');

  const fetchUsers = async (page: number = 1, limit: number = 10, search: string = '') => {
    setLoading(true);
    try {
      const response = await getUsers(page, limit, search);
      setUsers(response.users);
      setPagination({
        ...pagination,
        current: response.currentPage,
        total: response.total,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.roles);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchUsers(pagination.current, pagination.pageSize, searchText);
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchText(value);
    fetchUsers(1, pagination.pageSize, value);
  }, 300);

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleEdit = (record: User) => {
    // Implement edit functionality
    console.log('Edit user:', record);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      showSuccess('User deleted successfully');
      fetchUsers(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      handleError(error);
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
        const role = roles.find((r: Role) => r.id === roleId);
        return role ? role.name : 'N/A';
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) => (
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
      <h1>User Management</h1>
      <Search
        placeholder="Search users"
        onSearch={handleSearch}
        style={{ width: 200, marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default UserManagement;
