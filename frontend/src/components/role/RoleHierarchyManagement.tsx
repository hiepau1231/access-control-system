import React, { useState, useEffect } from 'react';
import { Table, Select, Button, message } from 'antd';
import { getRoles, getRoleHierarchy, addRoleHierarchy, Role, RoleHierarchy } from '../../services/api';

export const RoleHierarchyManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [hierarchy, setHierarchy] = useState<RoleHierarchy[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>();
  const [selectedChild, setSelectedChild] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchHierarchy();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await getRoles();
      setRoles(Array.isArray(response) ? response : []);
    } catch (error) {
      message.error('Failed to fetch roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      const data = await getRoleHierarchy();
      setHierarchy(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error('Failed to fetch role hierarchy');
      setHierarchy([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHierarchy = async () => {
    if (!selectedParent || !selectedChild) {
      message.warning('Please select both parent and child roles');
      return;
    }

    try {
      setLoading(true);
      await addRoleHierarchy(selectedParent, selectedChild);
      message.success('Role hierarchy added successfully');
      await fetchHierarchy();
    } catch (error) {
      message.error('Failed to add role hierarchy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Role Hierarchy Management</h2>
      
      <div className="mb-6 flex gap-4">
        <Select
          placeholder="Select parent role"
          style={{ width: 200 }}
          onChange={setSelectedParent}
          loading={loading}
        >
          {roles?.map(role => (
            <Select.Option key={role.id} value={role.id}>
              {role.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Select child role"
          style={{ width: 200 }}
          onChange={setSelectedChild}
          loading={loading}
        >
          {roles?.map(role => (
            <Select.Option key={role.id} value={role.id}>
              {role.name}
            </Select.Option>
          ))}
        </Select>

        <Button 
          type="primary" 
          onClick={handleAddHierarchy}
          loading={loading}
        >
          Add Hierarchy
        </Button>
      </div>

      <Table 
        columns={[
          {
            title: 'Parent Role',
            dataIndex: 'parent_role',
            key: 'parent_role',
          },
          {
            title: 'Child Role',
            dataIndex: 'child_role',
            key: 'child_role',
          }
        ]}
        dataSource={hierarchy}
        rowKey={(record) => `${record.parent_role}-${record.child_role}`}
        loading={loading}
      />
    </div>
  );
};
