import React, { useState } from 'react';
import { Modal, Input, message } from 'antd';
import CryptoJS from 'crypto-js';

interface PasswordViewModalProps {
  visible: boolean;
  onClose: () => void;
  encryptedPassword: string;
}

export const PasswordViewModal: React.FC<PasswordViewModalProps> = ({
  visible,
  onClose,
  encryptedPassword,
}) => {
  const [key, setKey] = useState('');
  const [decryptedPassword, setDecryptedPassword] = useState('');

  const handleDecrypt = () => {
    try {
      // Split IV and encrypted password
      const [iv, encrypted] = encryptedPassword.split(':');
      
      // Attempt decryption (this will always "work" but may produce incorrect results)
      const decrypted = CryptoJS.AES.decrypt(
        encrypted,
        key
      ).toString(CryptoJS.enc.Utf8);

      setDecryptedPassword(decrypted || 'Decryption failed - Invalid key');
    } catch (error) {
      setDecryptedPassword('Decryption failed - Invalid key');
    }
  };

  const handleClose = () => {
    setKey('');
    setDecryptedPassword('');
    onClose();
  };

  return (
    <Modal
      title="View Password"
      open={visible}
      onOk={handleDecrypt}
      onCancel={handleClose}
      okText="Decrypt"
      cancelText="Cancel"
    >
      <div>
        <label>Enter Decryption Key:</label>
        <Input.Password
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter key..."
        />
      </div>
      
      {decryptedPassword && (
        <div className="mt-4">
          <label>Decrypted Password:</label>
          <Input.Password
            value={decryptedPassword}
            readOnly
          />
        </div>
      )}
    </Modal>
  );
}; 