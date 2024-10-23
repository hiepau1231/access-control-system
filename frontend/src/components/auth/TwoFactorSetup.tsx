import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { enable2FA, verify2FA } from '../../services/auth';

const TwoFactorSetup: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);

  const handleEnable2FA = async () => {
    try {
      const response = await enable2FA();
      setQrCode(response.data.qrCodeDataUrl);
      setSecret(response.data.secret);
    } catch (error) {
      message.error('Failed to enable 2FA');
    }
  };

  const onFinish = async (values: { token: string }) => {
    try {
      await verify2FA(values.token);
      message.success('2FA enabled successfully');
    } catch (error) {
      message.error('Failed to verify 2FA token');
    }
  };

  return (
    <div>
      <Button onClick={handleEnable2FA}>Enable 2FA</Button>
      {qrCode && <img src={qrCode} alt="2FA QR Code" />}
      {secret && (
        <Form onFinish={onFinish}>
          <Form.Item
            name="token"
            rules={[{ required: true, message: 'Please input the 2FA token!' }]}
          >
            <Input placeholder="Enter 2FA token" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Verify and Enable 2FA
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default TwoFactorSetup;
