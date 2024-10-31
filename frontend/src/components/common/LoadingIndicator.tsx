import React from 'react';
import { Spin } from 'antd';
import { useLoading } from '../../contexts/LoadingContext';

interface LoadingIndicatorProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullScreen?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'default',
  tip,
  fullScreen = false,
}) => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  const content = (
    <Spin
      size={size}
      tip={tip || loadingMessage}
      className="flex items-center justify-center"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        {content}
      </div>
    );
  }

  return content;
};
