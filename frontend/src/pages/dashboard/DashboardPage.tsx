import React from 'react';
import Dashboard from '../../components/dashboard/Dashboard';

const DashboardPage: React.FC = () => {
  // TODO: Fetch actual user data from authentication context or API
  const username = "Người dùng";

  return <Dashboard username={username} />;
};

export default DashboardPage;
