import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, Select, message } from 'antd';
import { getPermissions, createPermission, updatePermission, deletePermission, getRoles, assignPermissionToRole, removePermissionFromRole } from '../../services/api';

const { Option } = Select;

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPermissionId, setEditingPermissionId] = useState<string | null>(null);

  useEffect(() => {
    fetchPermissions();
    fetchRoles();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await getPermissions();
      setPermissions(response.data);
    } catch (error) {
      message.error('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to fetch roles');
    }
  };

  const handleCreate = () => {
    setEditingPermissionId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingPermissionId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingPermissionId) {
        await updatePermission(editingPermissionId, values);
        message.success('Permission updated successfully');
      } else {
        await createPermission(values);
        message.success('Permission created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchPermissions();
    } catch (error) {
      message.error('Failed to save permission');
    }
  };

  const handleAssignToRole = async (permissionId: string, roleId: string) => {
    try {
      await assignPermissionToRole(roleId, permissionId);
      message.success('Permission assigned to role successfully');
    } catch (error) {
      message.error('Failed to assign permission to role');
    }
  };

  const handleRemoveFromRole = async (permissionId: string, roleId: string) => {
    try {
      await removePermissionFromRole(roleId, permissionId);
      message.success('Permission removed from role successfully');
    } catch (error) {
      message.error('Failed to remove permission from role');
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
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Delete
          </Button>
          <Select
            style={{ width: 200 }}
            placeholder="Assign to role"
            onChange={(roleId) => handleAssignToRole(record.id, roleId)}
          >
            {roles.map((role: any) => (
              <Option key={role.id} value={role.id}>{role.name}</Option>
            ))}
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={handleCreate} type="primary" style={{ marginBottom: 16 }}>
        Create New Permission
      </Button>
      <Table columns={columns} dataSource={permissions} rowKey="id" loading={loading} />
      <Modal
        title={editingPermissionId ? "Edit Permission" : "Create New Permission"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the permission name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the permission description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionManagement;
