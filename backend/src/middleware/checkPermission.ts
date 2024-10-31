import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

const ADMIN_ROLE_NAME = 'admin';

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Get user with role
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.id = :userId', { userId })
        .getOne();

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Nếu user có admin role, cho phép tất cả các quyền
      if (user.role.name === ADMIN_ROLE_NAME) {
        return next();
      }

      // Get all parent roles (including user's direct role)
      const roleRepository = AppDataSource.getRepository(Role);
      const roles = await roleRepository
        .createQueryBuilder('role')
        .where(qb => {
          const subQuery = qb
            .subQuery()
            .select('r.id')
            .from(Role, 'r')
            .leftJoin('role_hierarchy', 'rh', 'r.id = rh.child_role_id')
            .where('r.id = :roleId', { roleId: user.roleId })
            .getQuery();
          return 'role.id IN ' + subQuery;
        })
        .getMany();

      // Check if any of the roles has the required permission
      const permissionRepository = AppDataSource.getRepository(Permission);
      const hasPermission = await permissionRepository
        .createQueryBuilder('permission')
        .innerJoin('role_permissions', 'rp', 'permission.id = rp.permissionId')
        .where('rp.roleId IN (:...roleIds)', { roleIds: roles.map(r => r.id) })
        .andWhere('permission.name = :permissionName', { permissionName: requiredPermission })
        .getOne();

      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'Permission denied',
          details: `Missing required permission: ${requiredPermission}`
        });
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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
      }

      // Get user with role
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.id = :userId', { userId })
        .getOne();

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Nếu user có admin role, cho phép tất cả các quyền
      if (user.role.name === ADMIN_ROLE_NAME) {
        return next();
      }

      // Get all parent roles (including user's direct role)
      const roleRepository = AppDataSource.getRepository(Role);
      const roles = await roleRepository
        .createQueryBuilder('role')
        .where(qb => {
          const subQuery = qb
            .subQuery()
            .select('r.id')
            .from(Role, 'r')
            .leftJoin('role_hierarchy', 'rh', 'r.id = rh.child_role_id')
            .where('r.id = :roleId', { roleId: user.roleId })
            .getQuery();
          return 'role.id IN ' + subQuery;
        })
        .getMany();

      // Check permissions
      const permissionRepository = AppDataSource.getRepository(Permission);
      for (const permission of requiredPermissions) {
        const hasPermission = await permissionRepository
          .createQueryBuilder('permission')
          .innerJoin('role_permissions', 'rp', 'permission.id = rp.permissionId')
          .where('rp.roleId IN (:...roleIds)', { roleIds: roles.map(r => r.id) })
          .andWhere('permission.name = :permissionName', { permissionName: permission })
          .getOne();

        if (!hasPermission) {
          return res.status(403).json({
            message: 'Permission denied',
            details: `Missing required permission: ${permission}`
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