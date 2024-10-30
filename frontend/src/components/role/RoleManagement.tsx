import { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import {
  getRoles,
  getPermissions,
  updateRole, 
  deleteRole,
  getRolePermissions,
  assignPermissionToRole
} from '../../services/api';
import type { Role, Permission } from '../../services/api';

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (error) {
      message.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const permsData = await getPermissions();
      setPermissions(permsData);
    } catch (error) {
      message.error('Failed to fetch permissions');
    }
  };

  const fetchRolePermissions = async (roleId: string) => {
    try {
      const rolePerms = await getRolePermissions(roleId);
      setSelectedPermissions(rolePerms.map(p => p.id));
    } catch (error) {
      message.error('Failed to fetch role permissions');
    }
  };

  useEffect(() => {
    fetchRoles();
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
      <h2>Role Management</h2>
      <Table
        loading={loading}
        dataSource={roles}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default RoleManagement;