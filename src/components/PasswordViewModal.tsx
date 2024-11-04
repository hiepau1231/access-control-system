import { Modal, Input, Button, Alert, Spin, message } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordViewModalProps {
  visible: boolean;
  onClose: () => void;
  encryptedPassword: string;
}

const PasswordViewModal: React.FC<PasswordViewModalProps> = ({
  visible,
  onClose,
  encryptedPassword
}) => {
  const [decryptKey, setDecryptKey] = useState('');
  const [decryptedPassword, setDecryptedPassword] = useState('');
  const [error, setError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  const resetState = useCallback(() => {
    setDecryptKey('');
    setDecryptedPassword('');
    setError('');
    setIsDecrypting(false);
  }, []);

  const handleDecrypt = async () => {
    if (!decryptKey.trim()) {
      setError('Please enter a decryption key');
      return;
    }

    setIsDecrypting(true);
    setError('');
    setDecryptedPassword('');
    
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedPassword, decryptKey.trim());
      const password = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!password) {
        throw new Error('Invalid decryption key');
      }
      
      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      setDecryptedPassword(password);
    } catch (err) {
      setError('Failed to decrypt password. Please check your key.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && decryptKey.trim()) {
      handleDecrypt();
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  // Auto-close timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (decryptedPassword) {
      timer = setTimeout(() => {
        handleClose();
      }, 30000); // Auto close after 30 seconds
    }
    return () => clearTimeout(timer);
  }, [decryptedPassword]);

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(decryptedPassword);
      message.success('Password copied to clipboard');
    } catch (err) {
      message.error('Failed to copy password');
    }
  };

  return (
    <Modal
      title={
        <div className="text-lg font-semibold text-gray-800 pb-2 border-b">
          View Password
        </div>
      }
      open={visible}
      onCancel={handleClose}
      maskClosable={false}
      className="password-modal"
      footer={[
        <Button 
          key="cancel" 
          onClick={handleClose} 
          className="action-button"
          aria-label="Close modal"
        >
          Close
        </Button>,
        <Button 
          key="decrypt" 
          type="primary" 
          onClick={handleDecrypt}
          loading={isDecrypting}
          disabled={!decryptKey.trim()}
          className="action-button"
          aria-label="Decrypt password"
        >
          Decrypt
        </Button>
      ]}
    >
      <div className="modal-content">
        <div className="input-group">
          <Input.Password
            placeholder="Enter decryption key"
            value={decryptKey}
            onChange={e => setDecryptKey(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isDecrypting}
            autoFocus
            className="text-base"
            aria-label="Decryption key input"
          />
        </div>
        
        <AnimatePresence>
          {isDecrypting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="loading-overlay"
            >
              <Spin tip="Decrypting..." />
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <Alert 
                type="error" 
                message={error} 
                showIcon 
                closable
                className="alert-container border-error-color"
                onClose={() => setError('')}
              />
            </motion.div>
          )}

          {decryptedPassword && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Alert
                type="success"
                message={
                  <div className="font-medium text-success-color">
                    Password decrypted successfully
                  </div>
                }
                description={
                  <div className="password-display">
                    <div className="pr-10">{decryptedPassword}</div>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={handleCopyPassword}
                      className="absolute top-2 right-2 action-button"
                      aria-label="Copy password to clipboard"
                    />
                  </div>
                }
                showIcon
                className="alert-container border-success-color"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};

export default PasswordViewModal;
