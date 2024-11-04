import React, { useState } from 'react';
import { Modal, Input, Form, message } from 'antd';

interface PasswordViewModalProps {
  visible: boolean;
  onClose: () => void;
  encryptedPassword: string;
}

const PasswordViewModal = ({ visible, onClose, encryptedPassword }: PasswordViewModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);

  const onFinish = async (values: { secretKey: string }) => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encryptedPassword,
          secretKey: values.secretKey,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setDecryptedPassword(data.password);
      } else {
        message.error('Invalid decryption key');
      }
    } catch (error) {
      message.error('Failed to decrypt password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setDecryptedPassword(null);
    onClose();
  };

  return (
    <Modal
      title="View Password"
      open={visible}
      onCancel={handleClose}
      footer={null}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="secretKey"
          rules={[{ required: true, message: 'Please input decryption key!' }]}
        >
          <Input.Password placeholder="Enter decryption key" />
        </Form.Item>

        <Form.Item>
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Decrypting...' : 'Decrypt'}
          </button>
        </Form.Item>
      </Form>

      {decryptedPassword && (
        <div className="mt-4">
          <p className="font-bold">Decrypted Password:</p>
          <p className="font-mono bg-gray-100 p-2 rounded">{decryptedPassword}</p>
        </div>
      )}
    </Modal>
  );
};

export default PasswordViewModal; 