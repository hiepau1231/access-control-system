import { Request, Response } from 'express';
import { PermissionModel } from '../models/Permission';

const VALID_CATEGORIES = [
  'user_management',
  'role_management',
  'permission_management',
  'content_management',
  'system_settings',
  'reporting',
  'audit_logs'
];

export class PermissionController {
  async getAllPermissions(req: Request, res: Response) {
    try {
      const permissions = await PermissionModel.getAll();
      
      // Ensure all permissions have a category
      await PermissionModel.updateExistingPermissionsCategories();
      
      res.json(permissions);
    } catch (error) {
      console.error('Error getting permissions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getPermissionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const permission = await PermissionModel.findById(id);
      
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      
      res.json(permission);
    } catch (error) {
      console.error('Error getting permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createPermission(req: Request, res: Response) {
    try {
      const { name, description, category } = req.body;
      
      // Validate category
      if (category && !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ 
          message: 'Invalid category',
          validCategories: VALID_CATEGORIES 
        });
      }
      
      const permission = await PermissionModel.create({
        name,
        description,
        category: category || 'system_settings' // Default category
      });
      
      res.status(201).json(permission);
    } catch (error) {
      console.error('Error creating permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updatePermission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, category } = req.body;

      // Validate category if provided
      if (category && !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ 
          message: 'Invalid category',
          validCategories: VALID_CATEGORIES 
        });
      }

      const permission = await PermissionModel.findById(id);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }

      const updatedPermission = await PermissionModel.update(id, {
        name,
        description,
        category
      });

      res.json(updatedPermission);
    } catch (error) {
      console.error('Error updating permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deletePermission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const permission = await PermissionModel.findById(id);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }

      await PermissionModel.delete(id);
      res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
      console.error('Error deleting permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async assignToRole(req: Request, res: Response) {
    try {
      const { roleId, permissionId } = req.body;
      
      await PermissionModel.assignToRole(roleId, permissionId);
      
      res.status(200).json({ message: 'Permission assigned to role successfully' });
    } catch (error) {
      console.error('Error assigning permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async checkUserPermission(roleId: string, requiredPermission: string): Promise<boolean> {
    try {
      const permissions = await PermissionModel.getAll();
      const rolePermissions = await PermissionModel.getRolePermissions(roleId);
      
      const permission = permissions.find(p => p.name === requiredPermission);
      if (!permission) return false;
      
      return rolePermissions.includes(permission.id);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }
}