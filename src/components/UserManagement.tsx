import { Button, Table, message, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useState, useCallback } from 'react';

interface User {
  id: string;
  encryptedPassword: string;
  // ... other user properties
}

const UserManagement: React.FC = () => {
  const [viewingPassword, setViewingPassword] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleViewPassword = useCallback((user: User) => {
    if (!user.encryptedPassword) {
      message.error('No encrypted password available');
      return;
    }

    setViewingPassword(user.id);
    // Small delay to show loading state
    setTimeout(() => {
      setSelectedUser(user);
      setModalVisible(true);
      setViewingPassword(null);
    }, 300);
  }, []);

  const columns = [
    // ...existing columns...
    {
      title: 'Password',
      key: 'password',
      render: (_, record: User) => (
        <Tooltip 
          title={record.encryptedPassword ? "View password" : "No password available"}
          placement="top"
        >
          <Button
            icon={<EyeOutlined />}
            type="link"
            loading={viewingPassword === record.id}
            onClick={() => handleViewPassword(record)}
            disabled={!record.encryptedPassword}
            className={`
              action-button
              ${!record.encryptedPassword ? 'opacity-50' : 'hover:text-primary-color'}
            `}
            aria-label="View encrypted password"
          />
        </Tooltip>
      ),
    },
    // ...existing columns...
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Table 
        columns={columns}
        className="user-table"
        // ...existing table props...
      />
      {selectedUser && (
        <PasswordViewModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedUser(null);
          }}
          encryptedPassword={selectedUser.encryptedPassword}
        />
      )}
    </div>
  );
};

export default UserManagement;
