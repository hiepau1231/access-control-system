import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input, message, Space, Modal, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getPermissions, createPermission, updatePermission, deletePermission } from '../../services/api';
import { debounce } from '../../utils/debounce';
import Button from '../../components/common/Button';
import VirtualTable from '../../components/common/VirtualTable';

interface Permission {
  id: string;
  name: string;
  description: string;
}

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPermissionId, setEditingPermissionId] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPermissions();
      setPermissions(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

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
      render: (text: string, record: Permission) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger>Delete</Button>
        </Space>
      ),
    },
  ], []);

  const showModal = (permission?: Permission) => {
    if (permission) {
      setEditingPermissionId(permission.id);
      form.setFieldsValue(permission);
    } else {
      setEditingPermissionId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePermission(id);
      message.success('Permission deleted successfully');
      fetchPermissions();
    } catch (error) {
      message.error('Failed to delete permission');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Implement search logic here
  };

  // ... (rest of the component logic)

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <Input.Search
          placeholder="Search permissions"
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
          Add Permission
        </Button>
      </div>
      <VirtualTable
        columns={columns}
        dataSource={permissions}
        loading={loading}
        rowKey="id"
        scroll={{ y: 400 }}
      />
      {/* Modal code */}
    </div>
  );
};

export default PermissionManagement;
