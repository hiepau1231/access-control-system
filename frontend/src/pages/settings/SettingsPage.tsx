import React, { useState, useEffect } from 'react';
import { Card, message, Modal, Input } from 'antd';
import { enable2FA, verify2FA, disable2FA } from '../../services/api';
import Button from '../../components/common/Button';

const SettingsPage: React.FC = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Fetch user's 2FA status
    // Update is2FAEnabled state
  }, []);

  const handle2FAToggle = async () => {
    try {
      if (is2FAEnabled) {
        await disable2FA();
        setIs2FAEnabled(false);
        message.success('2FA has been disabled');
      } else {
        const response = await enable2FA();
        setQrCodeUrl(response.qrCodeUrl);
        setIsModalVisible(true);
      }
    } catch (error) {
      message.error('Failed to toggle 2FA');
    }
  };

  const handleVerify2FA = async () => {
    try {
      await verify2FA(verificationCode);
      setIs2FAEnabled(true);
      setIsModalVisible(false);
      message.success('2FA has been enabled');
    } catch (error) {
      message.error('Failed to verify 2FA');
    }
  };

  return (
    <div className="p-6">
      <Card title="Security Settings" className="w-full max-w-md mx-auto">
        <Button
          variant={is2FAEnabled ? "secondary" : "primary"}
          onClick={handle2FAToggle}
          className="w-full mb-4"
        >
          {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </Button>

        <Modal
          title="Set up 2FA"
          visible={isModalVisible}
          onOk={handleVerify2FA}
          onCancel={() => setIsModalVisible(false)}
        >
          <img src={qrCodeUrl} alt="2FA QR Code" className="mb-4 w-full" />
          <Input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="mb-4"
          />
          <Button variant="primary" onClick={handleVerify2FA} className="w-full">
            Verify
          </Button>
        </Modal>
      </Card>
    </div>
  );
};

export default SettingsPage;
