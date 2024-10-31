import React, { useState, useCallback, useEffect } from 'react';
import { Table, Input, message, Space, Modal, Form, Select, Tooltip } from 'antd';
import { 
  TeamOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SafetyCertificateOutlined 
} from '@ant-design/icons';
import { 
  getRoles, 
  createRole, 
  updateRole, 
  deleteRole, 
  getPermissions,
  assignPermissionToRole,
  getRolePermissions,
  getRoleFullPermissions
} from '../../services/api';
import { debounce } from '../../utils/debounce';
import { Button } from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import type { Role, Permission } from '../../services/api';

const { confirm } = Modal;

const RoleManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<string[]>([]);
  const [form] = Form.useForm();

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);
    } catch (error) {
      message.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      // Thử lấy full permissions trước
      const fetchedPermissions = await getPermissions();
      setPermissions(fetchedPermissions);
    } catch (error) {
      // Nếu không có quyền read:permissions, sẽ không hiển thị lỗi
      console.log('Could not fetch full permissions list');
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  const fetchRolePermissions = async (roleId: string) => {
    try {
      // Thử lấy permissions của role với quyền read:roles
      const permissions = await getRolePermissions(roleId);
      setSelectedRolePermissions(permissions.map(p => p.id));
    } catch (error) {
      message.error('Failed to fetch role permissions');
    }
  };

  const debouncedSearch = debounce((value: string) => {
    const filteredRoles = roles.filter(role => 
      role.name.toLowerCase().includes(value.toLowerCase()) ||
      role.description.toLowerCase().includes(value.toLowerCase())
    );
    setRoles(filteredRoles);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      fetchRoles(); // Reset to original list if search is cleared
    } else {
      debouncedSearch(value);
    }
  };

  const showModal = (role?: Role) => {
    if (role) {
      setSelectedRole(role);
      form.setFieldsValue(role);
    } else {
      setSelectedRole(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const showPermissionModal = async (role: Role) => {
    setSelectedRole(role);
    await fetchRolePermissions(role.id);
    setIsPermissionModalOpen(true);
  };

  const handlePermissionChange = async (newPermissions: string[]) => {
    if (!selectedRole) return;

    try {
      // Remove permissions that were unselected
      const removedPermissions = selectedRolePermissions.filter(p => !newPermissions.includes(p));
      // Add newly selected permissions
      const addedPermissions = newPermissions.filter(p => !selectedRolePermissions.includes(p));

      // Update permissions
      for (const permissionId of addedPermissions) {
        await assignPermissionToRole(selectedRole.id, permissionId);
      }

      setSelectedRolePermissions(newPermissions);
      message.success('Permissions updated successfully');
    } catch (error) {
      message.error('Failed to update permissions');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedRole) {
        await updateRole(selectedRole.id, values);
        message.success('Role updated successfully');
      } else {
        await createRole(values);
        message.success('Role created successfully');
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (error) {
      message.error('Failed to save role');
    }
  };

  const showDeleteConfirm = (id: string, name: string) => {
    confirm({
      title: 'Are you sure you want to delete this role?',
      content: `Role: ${name}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteRole(id);
          message.success('Role deleted successfully');
          fetchRoles();
        } catch (error) {
          message.error('Failed to delete role');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Role, b: Role) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: string, record: Role) => (
        <Space size="middle">
          <Tooltip title="Edit Role">
            <Button
              variant="primary"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Manage Permissions">
            <Button
              variant="secondary"
              icon={<SafetyCertificateOutlined />}
              onClick={() => showPermissionModal(record)}
            >
              Permissions
            </Button>
          </Tooltip>
          <Tooltip title="Delete Role">
            <Button
              variant="danger"
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record.id, record.name)}
            >
              Delete
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={`p-4 sm:p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <Input.Search
          placeholder="Search roles"
          value={searchTerm}
          onChange={handleSearch}
          className={`w-full sm:w-64 mb-4 sm:mb-0 ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
        />
        <Button
          variant="primary"
          icon={<TeamOutlined />}
          onClick={() => showModal()}
          className="w-full sm:w-auto"
        >
          Add Role
        </Button>
      </div>

      <Table<Role>
        columns={columns}
        dataSource={roles}
        loading={loading}
        rowKey="id"
        pagination={{
          total: roles.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} roles`,
        }}
        scroll={{ x: 'max-content' }}
        className={isDarkMode ? 'ant-table-dark' : ''}
      />

      {/* Role Modal */}
      <Modal
        title={selectedRole ? "Edit Role" : "Add Role"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width="95%"
        style={{ maxWidth: '500px' }}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="Role Name"
            rules={[
              { required: true, message: 'Please input role name!' },
              { min: 3, message: 'Role name must be at least 3 characters' },
              { pattern: /^[a-zA-Z0-9_-]+$/, message: 'Role name can only contain letters, numbers, underscores and hyphens' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="description" 
            label="Description"
            rules={[
              { required: true, message: 'Please input role description!' },
              { min: 10, message: 'Description must be at least 10 characters' }
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Permissions Modal */}
      <Modal
        title={`Manage Permissions - ${selectedRole?.name}`}
        open={isPermissionModalOpen}
        onOk={() => setIsPermissionModalOpen(false)}
        onCancel={() => setIsPermissionModalOpen(false)}
        width="95%"
        style={{ maxWidth: '600px' }}
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select permissions"
          value={selectedRolePermissions}
          onChange={handlePermissionChange}
          optionFilterProp="children"
          options={permissions.map(permission => ({
            value: permission.id,
            label: permission.name,
            title: permission.description
          }))}
        />
      </Modal>
    </div>
  );
};

export default RoleManagement;