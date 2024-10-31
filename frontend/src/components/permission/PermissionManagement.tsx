import React, { useState, useCallback, useEffect } from 'react';
import { Table, Input, message, Space, Modal, Form, Select, Tag } from 'antd';
import { 
  SafetyCertificateOutlined, 
  EditOutlined, 
  DeleteOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { 
  getPermissions, 
  createPermission, 
  updatePermission, 
  deletePermission 
} from '../../services/api';
import { debounce } from '../../utils/debounce';
import { Button } from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import type { Permission } from '../../services/api';
import { ColumnsType } from 'antd/es/table';

const { confirm } = Modal;

// Permission categories for grouping
const PERMISSION_CATEGORIES = [
  'user_management',
  'role_management',
  'permission_management',
  'content_management',
  'system_settings',
  'reporting',
  'audit_logs'
];

// Predefined permission actions
const PERMISSION_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'manage',
  'view',
  'approve',
  'reject'
];

// Predefined permission resources
const PERMISSION_RESOURCES = [
  'users',
  'roles',
  'permissions',
  'content',
  'settings',
  'reports',
  'logs'
];

const PermissionManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [form] = Form.useForm();

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPermissions = await getPermissions();
      setPermissions(fetchedPermissions);
    } catch (error) {
      message.error('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const debouncedSearch = debounce((value: string) => {
    const filteredPermissions = permissions.filter(permission => 
      permission.name.toLowerCase().includes(value.toLowerCase()) ||
      permission.description.toLowerCase().includes(value.toLowerCase())
    );
    setPermissions(filteredPermissions);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      fetchPermissions(); // Reset to original list if search is cleared
    } else {
      debouncedSearch(value);
    }
  };

  const showModal = (permission?: Permission) => {
    if (permission) {
      setSelectedPermission(permission);
      const [action, resource] = permission.name.split(':');
      setSelectedAction(action);
      setSelectedResource(resource);
      form.setFieldsValue({
        ...permission,
        action,
        resource
      });
    } else {
      setSelectedPermission(null);
      setSelectedAction('');
      setSelectedResource('');
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleActionChange = (value: string) => {
    setSelectedAction(value);
    updatePermissionName(value, selectedResource);
  };

  const handleResourceChange = (value: string) => {
    setSelectedResource(value);
    updatePermissionName(selectedAction, value);
  };

  const updatePermissionName = (action: string, resource: string) => {
    if (action && resource) {
      form.setFieldsValue({
        name: `${action}:${resource}`
      });
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedPermission) {
        await updatePermission(selectedPermission.id, values);
        message.success('Permission updated successfully');
      } else {
        await createPermission(values);
        message.success('Permission created successfully');
      }
      setIsModalOpen(false);
      fetchPermissions();
    } catch (error) {
      message.error('Failed to save permission');
    }
  };

  const showDeleteConfirm = (id: string, name: string) => {
    confirm({
      title: 'Are you sure you want to delete this permission?',
      content: (
        <div>
          <p>Permission: {name}</p>
          <p className="text-red-500">Warning: This action cannot be undone and may affect user access.</p>
        </div>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deletePermission(id);
          message.success('Permission deleted successfully');
          fetchPermissions();
        } catch (error) {
          message.error('Failed to delete permission');
        }
      },
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      user_management: 'blue',
      role_management: 'green',
      permission_management: 'purple',
      content_management: 'orange',
      system_settings: 'cyan',
      reporting: 'magenta',
      audit_logs: 'gold'
    };
    return colors[category] || 'default';
  };

  const columns: ColumnsType<Permission> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Permission, b: Permission) => a.name.localeCompare(b.name),
      render: (text: string) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>
          {category.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
      filters: PERMISSION_CATEGORIES.map(cat => ({
        text: cat.replace('_', ' ').toUpperCase(),
        value: cat
      })),
      onFilter: (value, record: Permission) => 
        record.category === value
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Permission) => (
        <Space size="middle">
          <Button
            variant="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id, record.name)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={`p-4 sm:p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <Input.Search
          placeholder="Search permissions"
          value={searchTerm}
          onChange={handleSearch}
          className={`w-full sm:w-64 mb-4 sm:mb-0 ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
        />
        <Button
          variant="primary"
          icon={<SafetyCertificateOutlined />}
          onClick={() => showModal()}
          className="w-full sm:w-auto"
        >
          Add Permission
        </Button>
      </div>

      <Table<Permission>
        columns={columns}
        dataSource={permissions}
        loading={loading}
        rowKey="id"
        pagination={{
          total: permissions.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} permissions`,
        }}
        scroll={{ x: 'max-content' }}
        className={isDarkMode ? 'ant-table-dark' : ''}
      />

      <Modal
        title={selectedPermission ? "Edit Permission" : "Add Permission"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width="95%"
        style={{ maxWidth: '500px' }}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="action" 
            label="Action"
            rules={[{ required: true, message: 'Please select an action!' }]}
            tooltip={{
              title: 'Select the action this permission grants',
              icon: <InfoCircleOutlined />
            }}
          >
            <Select
              placeholder="Select action"
              onChange={handleActionChange}
              value={selectedAction}
            >
              {PERMISSION_ACTIONS.map(action => (
                <Select.Option key={action} value={action}>
                  {action.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="resource" 
            label="Resource"
            rules={[{ required: true, message: 'Please select a resource!' }]}
            tooltip={{
              title: 'Select the resource this permission applies to',
              icon: <InfoCircleOutlined />
            }}
          >
            <Select
              placeholder="Select resource"
              onChange={handleResourceChange}
              value={selectedResource}
            >
              {PERMISSION_RESOURCES.map(resource => (
                <Select.Option key={resource} value={resource}>
                  {resource.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="name" 
            label="Permission Name"
            rules={[{ required: true, message: 'Permission name is required!' }]}
            tooltip={{
              title: 'This will be automatically generated from action and resource',
              icon: <InfoCircleOutlined />
            }}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
            tooltip={{
              title: 'Group similar permissions together',
              icon: <InfoCircleOutlined />
            }}
          >
            <Select>
              {PERMISSION_CATEGORIES.map(category => (
                <Select.Option key={category} value={category}>
                  {category.replace('_', ' ').toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Description"
            rules={[
              { required: true, message: 'Please input permission description!' },
              { min: 10, message: 'Description must be at least 10 characters' }
            ]}
            tooltip={{
              title: 'Provide a clear description of what this permission allows',
              icon: <InfoCircleOutlined />
            }}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionManagement;