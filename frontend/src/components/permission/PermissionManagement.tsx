import { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { getPermissions } from '../../services/api';
import type { Permission } from '../../services/api';

export const PermissionManagement = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await getPermissions();
      setPermissions(response);
    } catch (error) {
      message.error('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

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
    }
  ];

  return (
    <div>
      <h2>Permission Management</h2>
      <Table
        loading={loading}
        dataSource={permissions}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default PermissionManagement;