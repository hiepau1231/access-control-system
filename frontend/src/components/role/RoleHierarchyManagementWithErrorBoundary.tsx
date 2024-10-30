import React from 'react';
import RoleHierarchyManagement from './RoleHierarchyManagement';
import RoleHierarchyErrorBoundary from './RoleHierarchyErrorBoundary';

export const RoleHierarchyManagementWithErrorBoundary: React.FC = () => {
  return (
    <RoleHierarchyErrorBoundary>
      <RoleHierarchyManagement />
    </RoleHierarchyErrorBoundary>
  );
};
