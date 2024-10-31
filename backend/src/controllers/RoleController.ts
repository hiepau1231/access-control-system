import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import { User } from '../models/User';
import { RoleHierarchy } from '../models/RoleHierarchy';
import { v4 as uuidv4 } from 'uuid';

const ADMIN_ROLE_NAME = 'admin';

export class RoleController {
  async getAllRoles(req: Request, res: Response) {
    try {
      const roleRepository = AppDataSource.getRepository(Role);
      const roles = await roleRepository.find();
      res.json(roles);
    } catch (error) {
      console.error('Error getting roles:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRoleById(req: Request, res: Response) {
    try {
      const roleId = req.params.id;
      const roleRepository = AppDataSource.getRepository(Role);
      const role = await roleRepository.findOneBy({ id: roleId });
      
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

      const roleRepository = AppDataSource.getRepository(Role);
      
      // Kiểm tra role name đã tồn tại chưa
      const existingRole = await roleRepository.findOneBy({ name });
      if (existingRole) {
        return res.status(400).json({ error: 'Role name already exists' });
      }

      const newRole = roleRepository.create({
        id: uuidv4(),
        name,
        description: description || ''
      });

      await roleRepository.save(newRole);
      res.status(201).json(newRole);
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const roleId = req.params.id;
      const roleRepository = AppDataSource.getRepository(Role);
      const userRepository = AppDataSource.getRepository(User);
      const hierarchyRepository = AppDataSource.getRepository(RoleHierarchy);

      // Kiểm tra role có tồn tại không
      const role = await roleRepository.findOneBy({ id: roleId });
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      // Không cho phép xóa admin role
      if (role.name === ADMIN_ROLE_NAME) {
        return res.status(403).json({ error: 'Cannot delete admin role' });
      }

      // Kiểm tra xem có user nào đang sử dụng role này không
      const usersWithRole = await userRepository.count({ where: { roleId } });
      if (usersWithRole > 0) {
        return res.status(400).json({ error: 'Cannot delete role that is assigned to users' });
      }

      // Xóa role và các quan hệ liên quan
      await AppDataSource.transaction(async transactionalEntityManager => {
        // Xóa role permissions
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from('role_permissions')
          .where('roleId = :roleId', { roleId })
          .execute();

        // Xóa role hierarchy
        await hierarchyRepository.delete([
          { parent_role_id: roleId },
          { child_role_id: roleId }
        ]);

        // Xóa role
        await roleRepository.delete(roleId);
      });

      res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRolePermissions(req: Request, res: Response) {
    try {
      const roleId = req.params.id;
      const roleRepository = AppDataSource.getRepository(Role);
      const permissionRepository = AppDataSource.getRepository(Permission);
      
      const role = await roleRepository.findOneBy({ id: roleId });
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      const permissions = await permissionRepository
        .createQueryBuilder('permission')
        .innerJoin('role_permissions', 'rp', 'permission.id = rp.permissionId')
        .where('rp.roleId = :roleId', { roleId })
        .getMany();

      res.json(permissions);
    } catch (error) {
      console.error('Error getting role permissions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRoleHierarchy(req: Request, res: Response) {
    try {
      const hierarchyRepository = AppDataSource.getRepository(RoleHierarchy);
      const hierarchy = await hierarchyRepository
        .createQueryBuilder('rh')
        .select([
          'rh.parent_role_id as parentRoleId',
          'parentRole.name as parentRoleName',
          'rh.child_role_id as childRoleId',
          'childRole.name as childRoleName'
        ])
        .leftJoin('rh.parentRole', 'parentRole')
        .leftJoin('rh.childRole', 'childRole')
        .getRawMany();
      
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

      const roleRepository = AppDataSource.getRepository(Role);
      const hierarchyRepository = AppDataSource.getRepository(RoleHierarchy);
      
      // Kiểm tra roles tồn tại
      const [parentRole, childRole] = await Promise.all([
        roleRepository.findOneBy({ id: parent_role_id }),
        roleRepository.findOneBy({ id: child_role_id })
      ]);
      
      if (!parentRole || !childRole) {
        return res.status(404).json({ error: 'One or both roles not found' });
      }

      // Kiểm tra circular dependency
      const hasCircular = await this.checkCircularDependency(parent_role_id, child_role_id);
      if (hasCircular) {
        return res.status(400).json({ error: 'Circular dependency detected' });
      }

      // Thêm quan hệ hierarchy
      const hierarchy = hierarchyRepository.create({
        parent_role_id,
        child_role_id
      });
      await hierarchyRepository.save(hierarchy);

      res.status(201).json({ message: 'Role hierarchy added successfully' });
    } catch (error) {
      console.error('Error adding role hierarchy:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private async checkCircularDependency(parentId: string, childId: string): Promise<boolean> {
    const hierarchyRepository = AppDataSource.getRepository(RoleHierarchy);
    const result = await hierarchyRepository
      .createQueryBuilder('rh')
      .where('rh.child_role_id = :parentId', { parentId })
      .andWhere('rh.parent_role_id = :childId', { childId })
      .getCount();

    return result > 0;
  }
}