import React, { useState, useCallback, useEffect } from 'react';
import { Tree, Card, Select, Button as AntButton, message, Alert, Spin } from 'antd';
import { 
  PlusOutlined, 
  MinusOutlined, 
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { 
  getRoles, 
  getRoleHierarchy,
  addRoleHierarchy,
  removeRoleHierarchy
} from '../../services/api';
import { Button } from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import type { Role } from '../../services/api';
import { Skeleton } from '../common/Skeleton';
import { useLoading } from '../../contexts/LoadingContext';

interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
}

interface RoleRelation {
  parentRoleId: string;
  childRoleId: string;
}

interface RoleHierarchyManagementProps {
  onError?: (error: Error) => void;
}

const { Option } = Select;

const RoleHierarchyManagement: React.FC<RoleHierarchyManagementProps> = ({ onError }) => {
  const { isDarkMode } = useTheme();
  const [roles, setRoles] = useState<Role[]>([]);
  const [hierarchyData, setHierarchyData] = useState<RoleRelation[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedParentRole, setSelectedParentRole] = useState<string | null>(null);
  const [selectedChildRole, setSelectedChildRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoading } = useLoading();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesData, hierarchyData] = await Promise.all([
        getRoles(),
        getRoleHierarchy()
      ]);
      setRoles(rolesData);
      setHierarchyData(hierarchyData);
      buildTreeData(rolesData, hierarchyData);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch role hierarchy data');
      message.error(err.message);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const buildTreeData = (roles: Role[], hierarchy: RoleRelation[]) => {
    try {
      const roleMap = new Map(roles.map(role => [role.id, role]));
      const childrenMap = new Map<string, Set<string>>();
      const hasParent = new Set<string>();

      hierarchy.forEach(({ parentRoleId, childRoleId }) => {
        if (!childrenMap.has(parentRoleId)) {
          childrenMap.set(parentRoleId, new Set());
        }
        childrenMap.get(parentRoleId)?.add(childRoleId);
        hasParent.add(childRoleId);
      });

      const buildNode = (roleId: string): TreeNode => {
        const role = roleMap.get(roleId);
        if (!role) throw new Error(`Role not found: ${roleId}`);

        const children = childrenMap.get(roleId);
        return {
          key: roleId,
          title: role.name,
          children: children 
            ? Array.from(children).map(childId => buildNode(childId))
            : undefined
        };
      };

      const rootNodes = roles
        .filter(role => !hasParent.has(role.id))
        .map(role => buildNode(role.id));

      setTreeData(rootNodes);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to build role hierarchy tree');
      onError?.(err);
      setTreeData([]);
    }
  };

  const wouldCreateCircular = (parentId: string, childId: string): boolean => {
    const visited = new Set<string>();
    const checkCircular = (currentId: string): boolean => {
      if (currentId === childId) return true;
      if (visited.has(currentId)) return false;
      
      visited.add(currentId);
      const children = hierarchyData
        .filter(h => h.parentRoleId === currentId)
        .map(h => h.childRoleId);
      
      return children.some(checkCircular);
    };

    return checkCircular(parentId);
  };

  const handleAddRelation = async () => {
    if (!selectedParentRole || !selectedChildRole) {
      setError('Please select both parent and child roles');
      return;
    }

    if (selectedParentRole === selectedChildRole) {
      setError('A role cannot be its own parent');
      return;
    }

    if (wouldCreateCircular(selectedChildRole, selectedParentRole)) {
      const circularError = new Error('This would create a circular dependency');
      setError(circularError.message);
      onError?.(circularError);
      return;
    }

    try {
      await addRoleHierarchy(selectedParentRole, selectedChildRole);
      message.success('Role hierarchy relationship added successfully');
      fetchData();
      setSelectedParentRole(null);
      setSelectedChildRole(null);
      setError(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to add role hierarchy relationship');
      message.error(err.message);
      onError?.(err);
    }
  };

  const handleRemoveRelation = async () => {
    if (!selectedParentRole || !selectedChildRole) {
      setError('Please select both parent and child roles');
      return;
    }

    try {
      await removeRoleHierarchy(selectedParentRole, selectedChildRole);
      message.success('Role hierarchy relationship removed successfully');
      fetchData();
      setSelectedParentRole(null);
      setSelectedChildRole(null);
      setError(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to remove role hierarchy relationship');
      message.error(err.message);
      onError?.(err);
    }
  };

  if (isLoading) {
    return <Skeleton type="table" rows={6} />;
  }

  return (
    <div className={`p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="mb-6">
        <Alert
          message="Role Hierarchy Management"
          description="Manage parent-child relationships between roles. Child roles inherit permissions from their parent roles."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Role Hierarchy" bordered={false}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <Tree
              treeData={treeData}
              defaultExpandAll
              showLine={{ showLeafIcon: false }}
              className={isDarkMode ? 'ant-tree-dark' : ''}
            />
          )}
        </Card>

        <Card title="Manage Relationships" bordered={false}>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4"
              icon={<ExclamationCircleOutlined />}
            />
          )}

          <div className="space-y-4">
            <div>
              <label className="block mb-2">Parent Role</label>
              <Select
                placeholder="Select parent role"
                value={selectedParentRole}
                onChange={setSelectedParentRole}
                style={{ width: '100%' }}
                className="mb-4"
              >
                {roles.map(role => (
                  <Option key={role.id} value={role.id}>{role.name}</Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block mb-2">Child Role</label>
              <Select
                placeholder="Select child role"
                value={selectedChildRole}
                onChange={setSelectedChildRole}
                style={{ width: '100%' }}
                className="mb-4"
              >
                {roles.map(role => (
                  <Option key={role.id} value={role.id}>{role.name}</Option>
                ))}
              </Select>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="primary"
                icon={<PlusOutlined />}
                onClick={handleAddRelation}
                className="flex-1"
              >
                Add Relationship
              </Button>
              <Button
                variant="danger"
                icon={<MinusOutlined />}
                onClick={handleRemoveRelation}
                className="flex-1"
              >
                Remove Relationship
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Alert
          message="How Role Hierarchy Works"
          description={
            <ul className="list-disc pl-5 mt-2">
              <li>Child roles automatically inherit permissions from their parent roles</li>
              <li>A role can have multiple parent roles and multiple child roles</li>
              <li>Circular dependencies are not allowed and will be prevented</li>
              <li>Removing a relationship does not affect the roles themselves</li>
            </ul>
          }
          type="info"
          showIcon
        />
      </div>
    </div>
  );
};

export default RoleHierarchyManagement;