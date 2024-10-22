import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';
import { getRoles, createRole, updateRole, deleteRole } from '../../services/api';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRoleId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingRoleId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRoleId) {
        await updateRole(editingRoleId, values);
        message.success('Role updated successfully');
      } else {
        await createRole(values);
        message.success('Role created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchRoles();
    } catch (error) {
      message.error('Failed to save role');
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={handleCreate} type="primary" style={{ marginBottom: 16 }}>
        Create New Role
      </Button>
      <Table columns={columns} dataSource={roles} rowKey="id" loading={loading} />
      <Modal
        title={editingRoleId ? "Edit Role" : "Create New Role"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the role name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the role description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;
