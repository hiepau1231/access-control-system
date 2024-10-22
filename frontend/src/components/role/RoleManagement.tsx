import React, { useState, useEffect, useCallback } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';
import { getRoles, createRole, updateRole, deleteRole } from '../../services/api';

const { Search } = Input;

const RoleManagement: React.FC = React.memo(() => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRoles();
      setRoles(Array.isArray(response.data) ? response.data : []);
      setPagination(prev => ({ ...prev, total: Array.isArray(response.data) ? response.data.length : 0 }));
    } catch (error) {
      message.error('Không thể tải danh sách vai trò. Vui lòng thử lại sau.');
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

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
      message.success('Xóa vai trò thành công');
      fetchRoles();
    } catch (error) {
      message.error('Không thể xóa vai trò. Vui lòng thử lại sau.');
      console.error('Error deleting role:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRoleId) {
        await updateRole(editingRoleId, values);
        message.success('Cập nhật vai trò thành công');
      } else {
        await createRole(values);
        message.success('Tạo vai trò mới thành công');
      }
      setModalVisible(false);
      form.resetFields();
      fetchRoles();
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Không thể lưu vai trò: ${error.message}`);
      } else {
        message.error('Không thể lưu vai trò. Vui lòng thử lại sau.');
      }
      console.error('Error saving role:', error);
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
        placeholder="Tìm kiếm vai trò"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Button onClick={handleCreate} type="primary" style={{ marginBottom: 16 }}>
        Tạo vai trò mới
      </Button>
      <Table
        columns={columns}
        dataSource={Array.isArray(roles) ? roles : []}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={editingRoleId ? "Sửa vai trò" : "Tạo vai trò mới"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả vai trò!' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default RoleManagement;
