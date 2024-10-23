import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Input, Button, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getPermissions, deletePermission } from '../../services/api';
import { handleError, showSuccess } from '../../utils/errorHandler';
import { debounce } from '../../utils/debounce';
import LoadingIndicator from '../common/LoadingIndicator';
import '../../styles/animations.css';

const { Search } = Input;

interface Permission {
  id: string;
  name: string;
  description: string;
}

const PermissionManagement: React.FC = React.memo(() => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');

  const fetchPermissions = useCallback(async (page: number = 1, limit: number = 10, search: string = '') => {
    setLoading(true);
    try {
      const response = await getPermissions(page, limit, search);
      setPermissions(response.permissions);
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
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleTableChange = useCallback((pagination: any) => {
    fetchPermissions(pagination.current, pagination.pageSize, searchText);
  }, [fetchPermissions, searchText]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchText(value);
      fetchPermissions(1, pagination.pageSize, value);
    }, 300),
    [fetchPermissions, pagination.pageSize]
  );

  const handleSearch = useCallback((value: string) => {
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleEdit = useCallback((record: Permission) => {
    // Implement edit functionality
    console.log('Edit permission:', record);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deletePermission(id);
      showSuccess('Permission deleted successfully');
      fetchPermissions(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      handleError(error);
    }
  }, [fetchPermissions, pagination.current, pagination.pageSize, searchText]);

  const columns = useMemo(() => [
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
  ], [handleEdit, handleDelete]);

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
});

export default PermissionManagement;
