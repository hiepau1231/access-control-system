import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Input, message, Space, Modal, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRoles, createRole, updateRole, deleteRole } from '../../services/api';
import { debounce } from '../../utils/debounce';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../common/Button';
import VirtualTable from '../common/VirtualTable'; // Tạo component này sau

interface Role {
  id: string;
  name: string;
  description: string;
}

const RoleManagement: React.FC = () => {
  const { theme } = useTheme();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      // Ensure that data is an array
      setRoles(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error('Failed to fetch roles');
      setRoles([]); // Set to empty array in case of error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

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
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: Role) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger>Delete</Button>
        </Space>
      ),
    },
  ], []);

  const debouncedSearch = useMemo(() => 
    debounce((value: string) => {
      // Implement search logic here
      console.log('Searching for:', value);
    }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

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

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <Input.Search
          placeholder="Search roles"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:w-64 mb-4 sm:mb-0"
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
      <VirtualTable
        columns={columns}
        dataSource={roles}
        loading={loading}
        rowKey="id"
        scroll={{ y: 400 }}
      />
      <Modal
        title={editingRoleId ? "Edit Role" : "Add Role"}
        visible={isModalVisible}
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
    </div>
  );
};

export default RoleManagement;
