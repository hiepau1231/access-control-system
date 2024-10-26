import { Request, Response, NextFunction } from 'express';
import { PermissionController } from '../controllers/PermissionController';

interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    roleId: string;
  };
}

export const checkPermission = (requiredPermission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
      }

      // Tạm thời bỏ qua kiểm tra quyền cho admin user
      if (req.user.username === 'admin') {
        return next();
      }

      const permissionController = new PermissionController();
      const hasPermission = await permissionController.checkUserPermission(
        req.user.roleId,
        requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'Forbidden - Insufficient permissions' 
        });
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

// Utility middleware for checking multiple permissions
export const checkMultiplePermissions = (requiredPermissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
      }

      const permissionController = new PermissionController();
      const hasAllPermissions = await Promise.all(
        requiredPermissions.map(permission => 
          permissionController.checkUserPermission(req.user!.roleId, permission)
        )
      ).then(results => results.every(result => result));

      if (!hasAllPermissions) {
        return res.status(403).json({ 
          message: 'Forbidden - Insufficient permissions' 
        });
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
