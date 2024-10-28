import React, { useState, useEffect } from 'react';
import { Table, Select, Button, message, Spin, Alert } from 'antd';
import { getRoles, getRoleHierarchy, addRoleHierarchy, Role, RoleHierarchy } from '../../services/api';

export const RoleHierarchyManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [hierarchy, setHierarchy] = useState<RoleHierarchy[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>();
  const [selectedChild, setSelectedChild] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchHierarchy();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRoles();
      setRoles(Array.isArray(response) ? response : []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách vai trò';
      setError(errorMessage);
      message.error(errorMessage);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoleHierarchy();
      setHierarchy(Array.isArray(data) ? data : []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải phân cấp vai trò';
      setError(errorMessage);
      message.error(errorMessage);
      setHierarchy([]);
    } finally {
      setLoading(false);
    }
  };

  const validateHierarchy = (): { isValid: boolean; parentId: string; childId: string } | null => {
    if (!selectedParent || !selectedChild) {
      message.warning('Vui lòng chọn cả vai trò cha và vai trò con');
      return null;
    }

    if (selectedParent === selectedChild) {
      message.error('Vai trò cha và vai trò con không thể giống nhau');
      return null;
    }

    const existingHierarchy = hierarchy.find(
      h => h.parent_role === selectedParent && h.child_role === selectedChild
    );
    if (existingHierarchy) {
      message.error('Mối quan hệ phân cấp này đã tồn tại');
      return null;
    }

    return {
      isValid: true,
      parentId: selectedParent,
      childId: selectedChild
    };
  };

  const handleAddHierarchy = async () => {
    const validationResult = validateHierarchy();
    if (!validationResult) return;

    const { parentId, childId } = validationResult;

    try {
      setIsSubmitting(true);
      setError(null);
      await addRoleHierarchy(parentId, childId);
      message.success('Thêm phân cấp vai trò thành công');
      await fetchHierarchy();
      
      // Reset selections
      setSelectedParent(undefined);
      setSelectedChild(undefined);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể thêm phân cấp vai trò';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !hierarchy.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-2">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý Phân cấp Vai trò</h2>
      
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className="mb-4"
          closable
          onClose={() => setError(null)}
        />
      )}
      
      <div className="mb-6 flex gap-4">
        <Select
          placeholder="Chọn vai trò cha"
          style={{ width: 200 }}
          onChange={setSelectedParent}
          value={selectedParent}
          loading={loading}
          disabled={isSubmitting}
        >
          {roles?.map(role => (
            <Select.Option key={role.id} value={role.id}>
              {role.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Chọn vai trò con"
          style={{ width: 200 }}
          onChange={setSelectedChild}
          value={selectedChild}
          loading={loading}
          disabled={isSubmitting}
        >
          {roles?.map(role => (
            <Select.Option key={role.id} value={role.id}>
              {role.name}
            </Select.Option>
          ))}
        </Select>

        <Button 
          type="primary" 
          onClick={handleAddHierarchy}
          loading={isSubmitting}
          disabled={loading}
        >
          Thêm Phân cấp
        </Button>
      </div>

      <Table 
        columns={[
          {
            title: 'Vai trò Cha',
            dataIndex: 'parent_role',
            key: 'parent_role',
            render: (roleId) => {
              const role = roles.find(r => r.id === roleId);
              return role?.name || roleId;
            }
          },
          {
            title: 'Vai trò Con',
            dataIndex: 'child_role',
            key: 'child_role',
            render: (roleId) => {
              const role = roles.find(r => r.id === roleId);
              return role?.name || roleId;
            }
          }
        ]}
        dataSource={hierarchy}
        rowKey={(record) => `${record.parent_role}-${record.child_role}`}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} phân cấp`
        }}
      />
    </div>
  );
};