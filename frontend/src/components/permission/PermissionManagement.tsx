import React, { useState, useEffect, useCallback } from 'react';
import { Table, Space, Button, Modal, Form, Input, Select, message } from 'antd';
import { getPermissions, createPermission, updatePermission, deletePermission, getRoles, assignPermissionToRole, removePermissionFromRole } from '../../services/api';

const { Option } = Select;
const { Search } = Input;

const PermissionManagement: React.FC = React.memo(() => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPermissionId, setEditingPermissionId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPermissions();
      setPermissions(response.data);
      setPagination(prev => ({ ...prev, total: response.data.length }));
    } catch (error) {
      message.error('Không thể tải danh sách quyền. Vui lòng thử lại sau.');
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const memoizedFetchPermissions = useCallback(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách vai trò. Vui lòng thử lại sau.');
      console.error('Error fetching roles:', error);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

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
      message.success('Xóa quyền thành công');
      fetchPermissions();
    } catch (error) {
      message.error('Không thể xóa quyền. Vui lòng thử lại sau.');
      console.error('Error deleting permission:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingPermissionId) {
        await updatePermission(editingPermissionId, values);
        message.success('Cập nhật quyền thành công');
      } else {
        await createPermission(values);
        message.success('Tạo quyền mới thành công');
      }
      setModalVisible(false);
      form.resetFields();
      fetchPermissions();
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Không thể lưu quyền: ${error.message}`);
      } else {
        message.error('Không thể lưu quyền. Vui lòng thử lại sau.');
      }
      console.error('Error saving permission:', error);
    }
  };

  const handleAssignToRole = async (permissionId: string, roleId: string) => {
    try {
      await assignPermissionToRole(roleId, permissionId);
      message.success('Gán quyền cho vai trò thành công');
    } catch (error) {
      message.error('Không thể gán quyền cho vai trò. Vui lòng thử lại sau.');
      console.error('Error assigning permission to role:', error);
    }
  };

  const handleRemoveFromRole = async (permissionId: string, roleId: string) => {
    try {
      await removePermissionFromRole(roleId, permissionId);
      message.success('Gỡ bỏ quyền khỏi vai trò thành công');
    } catch (error) {
      message.error('Không thể gỡ bỏ quyền khỏi vai trò. Vui lòng thử lại sau.');
      console.error('Error removing permission from role:', error);
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Xóa
          </Button>
          <Select
            style={{ width: 200 }}
            placeholder="Gán cho vai trò"
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

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  return (
    <div>
      <Search
        placeholder="Tìm kiếm quyền"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Button onClick={handleCreate} type="primary" style={{ marginBottom: 16 }}>
        Tạo quyền mới
      </Button>
      <Table
        columns={columns}
        dataSource={permissions}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={editingPermissionId ? "Sửa quyền" : "Tạo quyền mới"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả quyền!' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default PermissionManagement;
