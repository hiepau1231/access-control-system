import { useState } from 'react';
import { Button, message } from 'antd';
import { enable2FA } from '../../services/auth';

export const TwoFactorSetup = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');

  const handleEnable2FA = async () => {
    try {
      const response = await enable2FA();
      setQrCode(response.qrCode);
      setSecret(response.secret);
    } catch (error) {
      message.error('Failed to enable 2FA');
    }
  };

  return (
    <div>
      <Button onClick={handleEnable2FA}>Enable 2FA</Button>
      {qrCode && (
        <div>
          <img src={qrCode} alt="2FA QR Code" />
          <p>Secret: {secret}</p>
        </div>
      )}
    </div>
  );
};