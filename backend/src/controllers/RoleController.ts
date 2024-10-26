import { Request, Response } from 'express';
import { RoleModel } from '../models/Role';

export class RoleController {
  async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await RoleModel.getAll();
      res.json(roles);
    } catch (error) {
      console.error('Error getting roles:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getRoleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await RoleModel.findById(id);
      
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      
      res.json(role);
    } catch (error) {
      console.error('Error getting role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createRole(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      
      const role = await RoleModel.create({
        name,
        description
      });
      
      res.status(201).json(role);
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getRolePermissions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const permissions = await RoleModel.getPermissions(id);
      res.json(permissions);
    } catch (error) {
      console.error('Error getting role permissions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
