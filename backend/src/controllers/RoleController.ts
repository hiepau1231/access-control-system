import { Request, Response } from 'express';
import { RoleModel, Role } from '../models/Role';
import cache from '../utils/cache';

export class RoleController {
  static async getAllRoles(req: Request, res: Response) {
    try {
      const { roles, total } = await RoleModel.getAll(page, limit, search);
      res.json({
        roles,
        total,
        page,
        limit
      });
    } catch (error) {
      console.error('Error getting all roles:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getRoleById(req: Request, res: Response) {
    try {
      const role = await RoleModel.findById(req.params.id);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      res.json(role);
    } catch (error) {
      console.error('Error getting role by id:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createRole(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const newRole = await RoleModel.create({ name, description });
      res.status(201).json(newRole);
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      await RoleModel.update(req.params.id, { name, description });
      res.json({ message: 'Role updated successfully' });
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      await RoleModel.delete(req.params.id);
      res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
