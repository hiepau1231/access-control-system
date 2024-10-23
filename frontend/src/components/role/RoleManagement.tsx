import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Input, Button, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getRoles, deleteRole } from '../../services/api';
import { handleError, showSuccess } from '../../utils/errorHandler';
import { debounce } from '../../utils/debounce';
import LoadingIndicator from '../common/LoadingIndicator';
import '../../styles/animations.css'

const { Search } = Input;

interface Role {
  id: string;
  name: string;
  description: string;
}

const RoleManagement: React.FC = React.memo(() => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');

  const fetchRoles = useCallback(async (page: number = 1, limit: number = 10, search: string = '') => {
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
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleTableChange = useCallback((pagination: any) => {
    fetchRoles(pagination.current, pagination.pageSize, searchText);
  }, [fetchRoles, searchText]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchText(value);
      fetchRoles(1, pagination.pageSize, value);
    }, 300),
    [fetchRoles, pagination.pageSize]
  );

  const handleSearch = useCallback((value: string) => {
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleEdit = useCallback((record: Role) => {
    // Implement edit functionality
    console.log('Edit role:', record);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteRole(id);
      showSuccess('Role deleted successfully');
      fetchRoles(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      handleError(error);
    }
  }, [fetchRoles, pagination.current, pagination.pageSize, searchText]);

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
      render: (_: any, record: Role) => (
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
      <div role="region" aria-label="Role Management" className="fade-in">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            <h1 id="role-management-title">Role Management</h1>
          </Col>
          <Col xs={24} sm={24} md={12} lg={16} xl={18}>
            <Search
              placeholder="Search roles"
              onSearch={handleSearch}
              style={{ width: '100%' }}
              aria-label="Search roles"
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: true }}
          aria-labelledby="role-management-title"
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  Total Roles: {roles.length}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </LoadingIndicator>
  );
});

export default RoleManagement;
