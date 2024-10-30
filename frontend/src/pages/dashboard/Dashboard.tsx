import React from 'react';
import { Card } from 'antd';
import { useAuth } from '../../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Card>
        <p>Welcome, {user?.username}!</p>
      </Card>
    </div>
  );
};

export default Dashboard; 