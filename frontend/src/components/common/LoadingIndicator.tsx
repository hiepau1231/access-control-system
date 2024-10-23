import React from 'react';
import { Spin } from 'antd';

interface LoadingIndicatorProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = React.memo(({ loading, children }) => {
  return (
    <Spin spinning={loading} tip="Loading...">
      {children}
    </Spin>
  );
});

export default LoadingIndicator;
