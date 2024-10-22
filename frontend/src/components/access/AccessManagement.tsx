import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

interface Permission {
  id: string;
  name: string;
  description: string;
}

const AccessManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Tên quyền',
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
      render: (text: string, record: Permission) => (
        <Button onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleEdit = (permission: Permission) => {
    form.setFieldsValue(permission);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      // TODO: Implement API call to add/edit permission
      console.log('Form values:', values);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Thêm quyền truy cập
      </Button>
      <Table columns={columns} dataSource={permissions} rowKey="id" />
      <Modal
        title="Thêm/Chỉnh sửa quyền truy cập"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
          >
            <Input placeholder="Tên quyền" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả quyền!' }]}
          >
            <Input.TextArea placeholder="Mô tả quyền" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccessManagement;
