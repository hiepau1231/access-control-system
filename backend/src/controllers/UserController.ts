import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { getDb } from '../config/database';

const ADMIN_ROLE_ID = '1'; // Giả sử ID 1 là admin role

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.getAll();
      res.json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await UserModel.update(id, updates);
      const updatedUser = await UserModel.findById(id);
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const db = await getDb();
      const { id: targetUserId } = req.params;
      const currentUserId = req.user?.id;
      
      // Kiểm tra user tồn tại
      const targetUser = await UserModel.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Không cho phép xóa chính mình
      if (targetUserId === currentUserId) {
        return res.status(403).json({ message: 'Cannot delete your own account' });
      }

      // Lấy thông tin role của cả 2 user
      const [currentUserRole, targetUserRole] = await Promise.all([
        db.get('SELECT roleId FROM users WHERE id = ?', [currentUserId]),
        db.get('SELECT roleId FROM users WHERE id = ?', [targetUserId])
      ]);

      // Nếu user bị xóa là admin, chỉ admin mới được xóa
      if (targetUserRole.roleId === ADMIN_ROLE_ID && currentUserRole.roleId !== ADMIN_ROLE_ID) {
        return res.status(403).json({ message: 'Cannot delete admin user' });
      }

      // Kiểm tra role hierarchy
      const canDelete = await this.checkRoleHierarchy(currentUserRole.roleId, targetUserRole.roleId);
      if (!canDelete) {
        return res.status(403).json({ 
          message: 'Permission denied - Cannot delete user with higher or equal role' 
        });
      }

      await UserModel.delete(targetUserId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  private async checkRoleHierarchy(currentRoleId: string, targetRoleId: string): Promise<boolean> {
    try {
      const db = await getDb();

      // Admin có thể xóa mọi user
      if (currentRoleId === ADMIN_ROLE_ID) {
        return true;
      }

      // Lấy tất cả các role con của current role
      const childRoles = await db.all(`
        WITH RECURSIVE role_tree AS (
          -- Base case: start with current role
          SELECT id FROM roles WHERE id = ?
          UNION ALL
          -- Recursive case: get child roles
          SELECT r.id
          FROM roles r
          JOIN role_hierarchy rh ON r.id = rh.child_role_id
          JOIN role_tree rt ON rt.id = rh.parent_role_id
        )
        SELECT id FROM role_tree
      `, [currentRoleId]);

      // Kiểm tra xem target role có phải là role con không
      return childRoles.some(role => role.id === targetRoleId);
    } catch (error) {
      console.error('Error checking role hierarchy:', error);
      return false;
    }
  }
}