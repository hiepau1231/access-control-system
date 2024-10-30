import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getPermissions, deletePermission } from '../../services/api';
import { handleError, showSuccess } from '../../utils/errorHandler';
import { debounce } from '../../utils/debounce';
import { LoadingIndicator } from '../common/LoadingIndicator';
import type { Permission } from '../../services/api';
import '../../styles/animations.css';

const { Search } = Input;

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  total: number;
}

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchPermissions = async (page: number, limit: number, searchTerm: string) => {
    setLoading(true);
    try {
      const response = await getPermissions(page, limit, searchTerm);
      setPermissions(response.data);
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

  const handleTableChange = (pagination: any) => {
    fetchPermissions(pagination.current, pagination.pageSize, search);
  };

  const debouncedSearch = debounce((value: string) => {
    setSearch(value);
    fetchPermissions(1, pagination.pageSize, value);
  }, 300);

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleEdit = (record: Permission) => {
    // Implement edit functionality
    console.log('Edit permission:', record);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePermission(id);
      showSuccess('Permission deleted successfully');
      fetchPermissions(pagination.current, pagination.pageSize, search);
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
      render: (_: any, record: Permission) => (
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
    <LoadingIndicator loading={loading}>
      <div role="region" aria-label="Permission Management" className="fade-in">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            <h1 id="permission-management-title">Permission Management</h1>
          </Col>
          <Col xs={24} sm={24} md={12} lg={16} xl={18}>
            <Search
              placeholder="Search permissions"
              onSearch={handleSearch}
              style={{ width: '100%' }}
              aria-label="Search permissions"
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: true }}
          aria-labelledby="permission-management-title"
        />
      </div>
    </LoadingIndicator>
  );
};

export default PermissionManagement;
