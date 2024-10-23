import { Request, Response } from 'express';
import { PermissionModel, Permission } from '../models/Permission';
import { Op } from 'sequelize';

export class PermissionController {
  static async getAllPermissions(req: Request, res: Response) {
    try {
      const permissions = await PermissionModel.getAll();
      res.json(permissions);
    } catch (error) {
      console.error('Error getting all permissions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getPermissionById(req: Request, res: Response) {
    try {
      const permission = await PermissionModel.findById(req.params.id);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      res.json(permission);
    } catch (error) {
      console.error('Error getting permission by id:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createPermission(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const newPermission = await PermissionModel.create({ name, description });
      res.status(201).json(newPermission);
    } catch (error) {
      console.error('Error creating permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updatePermission(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      await PermissionModel.update(req.params.id, { name, description });
      res.json({ message: 'Permission updated successfully' });
    } catch (error) {
      console.error('Error updating permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deletePermission(req: Request, res: Response) {
    try {
      await PermissionModel.delete(req.params.id);
      res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
      console.error('Error deleting permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async assignPermissionToRole(req: Request, res: Response) {
    try {
      const { roleId, permissionId } = req.body;
      await PermissionModel.assignToRole(roleId, permissionId);
      res.json({ message: 'Permission assigned to role successfully' });
    } catch (error) {
      console.error('Error assigning permission to role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async removePermissionFromRole(req: Request, res: Response) {
    try {
      const { roleId, permissionId } = req.body;
      await PermissionModel.removeFromRole(roleId, permissionId);
      res.json({ message: 'Permission removed from role successfully' });
    } catch (error) {
      console.error('Error removing permission from role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getPermissionsForRole(req: Request, res: Response) {
    try {
      const roleId = req.params.roleId;
      const permissions = await PermissionModel.getPermissionsForRole(roleId);
      res.json(permissions);
    } catch (error) {
      console.error('Error getting permissions for role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getPermissions(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let whereClause = {};
      if (search) {
        whereClause = {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
          ]
        };
      }

      const permissions = await Permission.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset: offset
      });

      res.json({
        total: permissions.count,
        permissions: permissions.rows,
        currentPage: Number(page),
        totalPages: Math.ceil(permissions.count / Number(limit))
      });
    } catch (error) {
      console.error('Error fetching permissions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
