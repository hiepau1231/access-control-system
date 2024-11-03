import { Request, Response } from 'express';
import { User, UserModel } from '../models/User';
import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { getRepository } from 'typeorm';

const ADMIN_ROLE_NAME = 'admin';

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      console.log('Getting all users...');
      const userRepository = AppDataSource.getRepository(User);
      
      const users = await userRepository.find({
        relations: ['role'],
        select: {
          id: true,
          username: true,
          email: true,
          roleId: true,
          encryptedPassword: true,
        }
      });
      
      console.log('Users found:', users.length);
      return res.json(users);
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
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
      const userRepository = getRepository(User);
      const { username, email, password, roleId } = req.body;

      const user = new User();
      user.username = username;
      user.email = email;
      user.password = password;
      user.encryptedPassword = User.encryptPassword(password);
      user.roleId = roleId;

      await userRepository.save(user);
      
      return res.status(201).json({
        message: 'User created successfully',
        user: {
          ...user,
          password: undefined
        }
      });
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