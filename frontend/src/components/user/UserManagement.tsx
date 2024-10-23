import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Input, Button, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getUsers, getRoles, deleteUser } from '../../services/api';
import { handleError, showSuccess } from '../../utils/errorHandler';
import { debounce } from '../../utils/debounce';
import LoadingIndicator from '../common/LoadingIndicator';
import '../../styles/animations.css'

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

const UserManagement: React.FC = React.memo(() => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleEdit = useCallback((record: User) => {
    console.log('Edit user:', record);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setActionLoading(true);
    try {
      await deleteUser(id);
      showSuccess('User deleted successfully');
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      const userElement = document.getElementById(`user-${id}`);
      if (userElement) {
        userElement.classList.add('fade-out');
        setTimeout(() => {
          fetchUsers(pagination.current, pagination.pageSize, searchText);
        }, 500);
      } else {
        fetchUsers(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setActionLoading(false);
    }
  }, [fetchUsers, pagination.current, pagination.pageSize, searchText]);

  const columns = useMemo(() => [
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
  ], [roles]); // Only re-create columns when roles change

  return (
    <LoadingIndicator loading={actionLoading}>
      <div role="region" aria-label="User Management" className="fade-in">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            <h1 id="user-management-title">User Management</h1>
          </Col>
          <Col xs={24} sm={24} md={12} lg={16} xl={18}>
            <Search
              placeholder="Search users"
              onSearch={handleSearch}
              style={{ width: '100%' }}
              aria-label="Search users"
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: true }}
          aria-labelledby="user-management-title"
        />
      </div>
    </LoadingIndicator>
  );
});

export default UserManagement;
