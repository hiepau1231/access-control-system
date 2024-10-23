import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getRoles, deleteRole } from '../../services/api';
import { handleError, showSuccess } from '../../utils/errorHandler';

const { Search } = Input;

interface Role {
  id: string;
  name: string;
  description: string;
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');

  const fetchRoles = async (page: number = 1, limit: number = 10, search: string = '') => {
    setLoading(true);
    try {
      const response = await getRoles(page, limit, search);
      setRoles(response.roles);
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

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchRoles(pagination.current, pagination.pageSize, searchText);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchRoles(1, pagination.pageSize, value);
  };

  const handleEdit = (record: Role) => {
    // Implement edit functionality
    console.log('Edit role:', record);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id);
      showSuccess('Role deleted successfully');
      fetchRoles(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Role) => (
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
      <h1>Role Management</h1>
      <Search
        placeholder="Search roles"
        onSearch={handleSearch}
        style={{ width: 200, marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default RoleManagement;
