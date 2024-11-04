import { Table, Button, Tag, Space } from 'antd';
import { useState } from 'react';
import { motion } from 'framer-motion';

const PermissionList: React.FC = () => {
  // ...existing state...

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-lg shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Permissions Management
        </h1>
        <Button 
          type="primary"
          onClick={/* your handler */}
          className="action-button bg-primary-color hover:bg-primary-color/90"
        >
          Add Permission
        </Button>
      </div>

      <div className="permission-filters mb-4 space-y-4 md:space-y-0 md:flex md:space-x-4">
        {/* Your existing filters */}
      </div>

      <Table 
        columns={[
          {
            title: 'Permission Name',
            dataIndex: 'name',
            render: (text) => (
              <span className="font-medium text-gray-700">{text}</span>
            )
          },
          {
            title: 'Type',
            dataIndex: 'type',
            render: (type) => (
              <Tag 
                color={type === 'read' ? 'blue' : type === 'write' ? 'green' : 'orange'}
                className="px-3 py-1 uppercase text-xs font-semibold"
              >
                {type}
              </Tag>
            )
          },
          {
            title: 'Actions',
            render: (_, record) => (
              <Space>
                <Button 
                  type="link" 
                  className="text-primary-color hover:text-primary-color/80"
                >
                  Edit
                </Button>
                <Button 
                  type="link" 
                  className="text-error-color hover:text-error-color/80"
                >
                  Delete
                </Button>
              </Space>
            )
          }
        ]}
        className="permission-table"
        // ...other table props
      />
    </motion.div>
  );
};

export default PermissionList;
