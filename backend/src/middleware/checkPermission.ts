import { Request, Response, NextFunction } from 'express';
import { getDb } from '../config/database';

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const db = await getDb();
      
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Get user's role
      const user = await db.get('SELECT roleId FROM users WHERE id = ?', [userId]);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Get all parent roles (including user's direct role)
      const roles = await db.all(`
        WITH RECURSIVE role_tree AS (
          -- Base case: start with user's role
          SELECT id, name FROM roles WHERE id = ?
          UNION ALL
          -- Recursive case: get parent roles
          SELECT r.id, r.name
          FROM roles r
          JOIN role_hierarchy rh ON r.id = rh.parent_role_id
          JOIN role_tree rt ON rt.id = rh.child_role_id
        )
        SELECT DISTINCT id FROM role_tree
      `, [user.roleId]);

      // Check if any of the roles has the required permission
      const hasPermission = await db.get(`
        SELECT 1
        FROM role_permissions rp
        WHERE rp.roleId IN (${roles.map(() => '?').join(',')})
        AND rp.permissionId IN (
          SELECT id FROM permissions WHERE name = ?
        )
        LIMIT 1
      `, [...roles.map(r => r.id), requiredPermission]);

      if (!hasPermission) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// Utility middleware for checking multiple permissions
export const checkMultiplePermissions = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const db = await getDb();
      
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
      }

      // Kiểm tra tất cả các quyền
      for (const permission of requiredPermissions) {
        const hasPermission = await checkPermission(permission)(req, res, () => {});
        if (hasPermission === false) {
          return res.status(403).json({ 
            message: `Missing required permission: ${permission}` 
          });
        }
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ 
        message: 'Internal server error during permission check' 
      });
    }
  };
};
