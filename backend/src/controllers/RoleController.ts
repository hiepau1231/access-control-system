import { Request, Response } from 'express';
import { RoleModel } from '../models/Role';
import { getDb } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class RoleController {
  async getAllRoles(req: Request, res: Response) {
    try {
      const db = await getDb();
      const roles = await db.all('SELECT * FROM roles');
      res.json(roles);
    } catch (error) {
      console.error('Error getting roles:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getRoleById(req: Request, res: Response) {
    try {
      const db = await getDb();
      const { id } = req.params;
      const role = await db.get('SELECT * FROM roles WHERE id = ?', [id]);
      
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
      const db = await getDb();
      const { name, description } = req.body;
      
      const result = await db.run(
        'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
        [uuidv4(), name, description]
      );
      
      const newRole = await db.get('SELECT * FROM roles WHERE id = ?', [result.lastID]);
      res.status(201).json(newRole);
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getRolePermissions(req: Request, res: Response) {
    try {
      const db = await getDb();
      const { id } = req.params;
      const permissions = await db.all(`
        SELECT p.* 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permissionId
        WHERE rp.roleId = ?
      `, [id]);
      res.json(permissions);
    } catch (error) {
      console.error('Error getting role permissions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async addRoleHierarchy(req: Request, res: Response) {
    try {
      const db = await getDb();
      const { parentRoleId, childRoleId } = req.body;
      
      // Check for circular dependency
      const hasCircular = await this.checkCircularDependency(parentRoleId, childRoleId);
      if (hasCircular) {
        return res.status(400).json({ error: 'Circular dependency detected' });
      }

      await db.run(
        'INSERT INTO role_hierarchy (parent_role_id, child_role_id) VALUES (?, ?)',
        [parentRoleId, childRoleId]
      );

      res.status(201).json({ message: 'Role hierarchy created successfully' });
    } catch (error) {
      console.error('Error creating role hierarchy:', error);
      res.status(500).json({ error: 'Failed to create role hierarchy' });
    }
  }

  async getRoleHierarchy(req: Request, res: Response) {
    try {
      const db = await getDb();
      const hierarchy = await db.all(`
        SELECT r1.name as parent_role, r2.name as child_role
        FROM role_hierarchy rh
        JOIN roles r1 ON rh.parent_role_id = r1.id
        JOIN roles r2 ON rh.child_role_id = r2.id
      `);

      res.json(hierarchy);
    } catch (error) {
      console.error('Error fetching role hierarchy:', error);
      res.status(500).json({ error: 'Failed to fetch role hierarchy' });
    }
  }

  private async checkCircularDependency(parentId: string, childId: string): Promise<boolean> {
    const db = await getDb();
    const visited = new Set<string>();
    
    const checkCycle = async (currentId: string): Promise<boolean> => {
      if (visited.has(currentId)) return false;
      if (currentId === childId) return true;
      
      visited.add(currentId);
      
      const children = await db.all(
        'SELECT child_role_id FROM role_hierarchy WHERE parent_role_id = ?',
        [currentId]
      );
      
      for (const child of children) {
        if (await checkCycle(child.child_role_id)) {
          return true;
        }
      }
      
      return false;
    };

    return checkCycle(parentId);
  }
}
