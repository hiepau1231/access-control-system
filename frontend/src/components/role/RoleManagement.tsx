import React, { useState, useCallback } from 'react';
import { Table, Input, message, Space, Modal, Form, Transfer } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';
import { 
  getRoles, 
  createRole, 
  updateRole, 
  deleteRole,
  getAllPermissions,
  getRolePermissions,
  assignPermissionToRole
} from '../../services/api';
import { debounce } from '../../utils/debounce';
import { Button } from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import type { Role, Permission } from '../../services/api';

const RoleManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const roles = await getRoles();
      setRoles(roles);
    } catch (error) {
      message.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissions = async () => {
    try {
      const perms = await getAllPermissions();
      setPermissions(perms);
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

  React.useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = debounce((value: string) => {
    // Implement search logic here
    console.log('Searching for:', value);
  }, 300);

  const showModal = (role?: Role) => {
    if (role) {
      setEditingRoleId(role.id);
      form.setFieldsValue(role);
    } else {
      setEditingRoleId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const showPermissionModal = async (role: Role) => {
    setCurrentRole(role);
    await fetchRolePermissions(role.id);
    setIsPermissionModalVisible(true);
  };

  const handlePermissionModalOk = async () => {
    if (!currentRole) return;

    try {
      // Remove all existing permissions and add new ones
      for (const permId of selectedPermissions) {
        await assignPermissionToRole(currentRole.id, permId);
      }
      message.success('Permissions updated successfully');
      setIsPermissionModalVisible(false);
    } catch (error) {
      message.error('Failed to update permissions');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRoleId) {
        await updateRole(editingRoleId, values);
        message.success('Role updated successfully');
      } else {
        await createRole(values);
        message.success('Role created successfully');
      }
      setIsModalVisible(false);
      fetchRoles();
    } catch (error) {
      message.error('Failed to save role');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id);
      message.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      message.error('Failed to delete role');
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
      title: 'Actions',
      key: 'actions',
      render: (_: string, record: Role) => (
        <Space size="middle">
          <Button
            variant="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button
            variant="primary"
            icon={<KeyOutlined />}
            onClick={() => showPermissionModal(record)}
          >
            Permissions
          </Button>
          <Button
            variant="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handlePermissionChange = (
    targetKeys: string[], 
    _direction: TransferDirection, 
    _moveKeys: React.Key[]
  ) => {
    setSelectedPermissions(targetKeys);
  };

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
          icon={<PlusOutlined />}
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
          showSizeChanger: false,
        }}
        scroll={{ x: 'max-content' }}
        className={isDarkMode ? 'ant-table-dark' : ''}
      />

      <Modal
        title={editingRoleId ? "Edit Role" : "Add Role"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width="95%"
        style={{ maxWidth: '500px' }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Manage Permissions - ${currentRole?.name}`}
        open={isPermissionModalVisible}
        onOk={handlePermissionModalOk}
        onCancel={() => setIsPermissionModalVisible(false)}
        width="95%"
        style={{ maxWidth: '700px' }}
      >
        <Transfer<Permission>
          dataSource={permissions}
          titles={['Available', 'Assigned']}
          targetKeys={selectedPermissions}
          onChange={handlePermissionChange as any} // Type assertion to fix type mismatch
          render={item => item.name}
          rowKey={item => item.id}
          listStyle={{
            width: 300,
            height: 400,
          }}
        />
      </Modal>
    </div>
  );
};

export default RoleManagement;
