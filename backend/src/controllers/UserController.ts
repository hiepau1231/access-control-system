import { Request, Response } from 'express';
import { User, UserModel } from '../models/User';
import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';

const ADMIN_ROLE_NAME = 'admin';

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

  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, roleId } = req.body;

      // Validate required fields
      if (!username || !email || !password || !roleId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if username or email already exists
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({
        where: [{ username }, { email }]
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: 'Username or email already exists' 
        });
      }

      // Check if role exists
      const roleRepository = AppDataSource.getRepository(Role);
      const role = await roleRepository.findOneBy({ id: roleId });
      if (!role) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const user = await UserModel.create({
        username,
        email,
        password,
        roleId
      });

      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error('Error creating user:', error);
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

      // If updating role, check if role exists
      if (updates.roleId) {
        const roleRepository = AppDataSource.getRepository(Role);
        const role = await roleRepository.findOneBy({ id: updates.roleId });
        if (!role) {
          return res.status(400).json({ message: 'Invalid role' });
        }
      }

      const updatedUser = await UserModel.update(id, updates);
      if (updatedUser) {
        // Remove password from response
        const { password: _, ...userResponse } = updatedUser;
        res.json(userResponse);
      } else {
        res.status(500).json({ message: 'Failed to update user' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id: targetUserId } = req.params;
      const currentUserId = req.user?.id;

      if (!currentUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Check if user exists
      const targetUser = await UserModel.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Cannot delete your own account
      if (targetUserId === currentUserId) {
        return res.status(403).json({ message: 'Cannot delete your own account' });
      }

      // Get current user with role
      const currentUser = await UserModel.findById(currentUserId);
      if (!currentUser || !currentUser.role) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      // Only admin can delete admin users
      if (targetUser.role?.name === ADMIN_ROLE_NAME && currentUser.role.name !== ADMIN_ROLE_NAME) {
        return res.status(403).json({ message: 'Cannot delete admin user' });
      }

      await UserModel.delete(targetUserId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}