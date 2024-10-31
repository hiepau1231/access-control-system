import React from 'react';
import { Skeleton as AntSkeleton } from 'antd';

interface SkeletonProps {
  type?: 'table' | 'form' | 'list';
  rows?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ type = 'table', rows = 4 }) => {
  switch (type) {
    case 'table':
      return (
        <div className="w-full">
          {Array.from({ length: rows }).map((_, index) => (
            <AntSkeleton key={index} active paragraph={{ rows: 1 }} />
          ))}
        </div>
      );
    
    case 'form':
      return (
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <AntSkeleton.Input active />
            </div>
          ))}
        </div>
      );

    case 'list':
      return <AntSkeleton active paragraph={{ rows }} />;
  }
};

export default Skeleton; 