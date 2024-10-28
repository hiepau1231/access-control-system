import { Request, Response } from 'express';
import { RoleModel } from '../models/Role';
import { getDb } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const ADMIN_ROLE_NAME = 'admin';

export class RoleController {
  async getAllRoles(req: Request, res: Response) {
    try {
      const db = await getDb();
      const roles = await db.all('SELECT * FROM roles');
      res.json(roles);
    } catch (error) {
      console.error('Error getting roles:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRoleById(req: Request, res: Response) {
    try {
      const roleId = req.params.id;
      const db = await getDb();
      const role = await db.get('SELECT * FROM roles WHERE id = ?', [roleId]);
      
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      
      res.json(role);
    } catch (error) {
      console.error('Error getting role:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createRole(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Role name is required' });
      }

      const db = await getDb();
      
      // Kiểm tra role name đã tồn tại chưa
      const existingRole = await db.get('SELECT * FROM roles WHERE name = ?', [name]);
      if (existingRole) {
        return res.status(400).json({ error: 'Role name already exists' });
      }

      const roleId = uuidv4();
      await db.run(
        'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
        [roleId, name, description || '']
      );

      const newRole = await db.get('SELECT * FROM roles WHERE id = ?', [roleId]);
      res.status(201).json(newRole);
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const roleId = req.params.id;
      const db = await getDb();

      // Kiểm tra role có tồn tại không
      const role = await db.get('SELECT * FROM roles WHERE id = ?', [roleId]);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      // Không cho phép xóa admin role
      if (role.name === ADMIN_ROLE_NAME) {
        return res.status(403).json({ error: 'Cannot delete admin role' });
      }

      // Kiểm tra xem có user nào đang sử dụng role này không
      const usersWithRole = await db.get('SELECT COUNT(*) as count FROM users WHERE roleId = ?', [roleId]);
      if (usersWithRole.count > 0) {
        return res.status(400).json({ error: 'Cannot delete role that is assigned to users' });
      }

      // Xóa các permission liên quan đến role này
      await db.run('DELETE FROM role_permissions WHERE roleId = ?', [roleId]);
      
      // Xóa role hierarchy liên quan
      await db.run('DELETE FROM role_hierarchy WHERE parent_role_id = ? OR child_role_id = ?', [roleId, roleId]);
      
      // Xóa role
      await db.run('DELETE FROM roles WHERE id = ?', [roleId]);

      res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRolePermissions(req: Request, res: Response) {
    try {
      const roleId = req.params.id;
      const db = await getDb();
      
      const role = await db.get('SELECT * FROM roles WHERE id = ?', [roleId]);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      const permissions = await db.all(`
        SELECT p.* 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permissionId
        WHERE rp.roleId = ?
      `, [roleId]);

      res.json(permissions);
    } catch (error) {
      console.error('Error getting role permissions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRoleHierarchy(req: Request, res: Response) {
    try {
      const db = await getDb();
      const hierarchy = await db.all(`
        SELECT 
          r1.id as parent_role_id,
          r1.name as parent_role_name,
          r2.id as child_role_id,
          r2.name as child_role_name
        FROM role_hierarchy rh
        JOIN roles r1 ON rh.parent_role_id = r1.id
        JOIN roles r2 ON rh.child_role_id = r2.id
      `);
      
      res.json(hierarchy);
    } catch (error) {
      console.error('Error getting role hierarchy:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addRoleHierarchy(req: Request, res: Response) {
    try {
      const { parent_role_id, child_role_id } = req.body;
      if (!parent_role_id || !child_role_id) {
        return res.status(400).json({ error: 'Parent and child role IDs are required' });
      }

      const db = await getDb();
      
      // Kiểm tra roles tồn tại
      const parentRole = await db.get('SELECT * FROM roles WHERE id = ?', [parent_role_id]);
      const childRole = await db.get('SELECT * FROM roles WHERE id = ?', [child_role_id]);
      
      if (!parentRole || !childRole) {
        return res.status(404).json({ error: 'One or both roles not found' });
      }

      // Kiểm tra circular dependency
      const hasCircular = await this.checkCircularDependency(db, parent_role_id, child_role_id);
      if (hasCircular) {
        return res.status(400).json({ error: 'Circular dependency detected' });
      }

      // Thêm quan hệ hierarchy
      await db.run(
        'INSERT INTO role_hierarchy (parent_role_id, child_role_id) VALUES (?, ?)',
        [parent_role_id, child_role_id]
      );

      res.status(201).json({ message: 'Role hierarchy added successfully' });
    } catch (error) {
      console.error('Error adding role hierarchy:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private async checkCircularDependency(db: any, parentId: string, childId: string): Promise<boolean> {
    // Kiểm tra nếu child role đã là parent của parent role
    const result = await db.get(`
      WITH RECURSIVE hierarchy_path AS (
        SELECT child_role_id, parent_role_id, 1 as level
        FROM role_hierarchy
        WHERE child_role_id = ?
        UNION ALL
        SELECT rh.child_role_id, rh.parent_role_id, hp.level + 1
        FROM role_hierarchy rh
        JOIN hierarchy_path hp ON rh.child_role_id = hp.parent_role_id
      )
      SELECT COUNT(*) as count
      FROM hierarchy_path
      WHERE parent_role_id = ?
    `, [parentId, childId]);

    return result.count > 0;
  }
}