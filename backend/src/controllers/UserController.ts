import { Request, Response } from 'express';
import { UserModel, User } from '../models/User';
import bcrypt from 'bcrypt';
import { decrypt } from '../utils/encryption';

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const { users, total } = await UserModel.getAll(page, limit, search);
      res.json({
        users: users.map(user => ({ ...user, password: undefined })),
        total,
        page,
        limit
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error('Error getting user by id:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { username, email, roleId, password } = req.body;
      const updates: Partial<User> = { username, email, roleId };

      if (password) {
        updates.password = await bcrypt.hash(password, 10);
      }

      await UserModel.update(req.params.id, updates);
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ message: 'Username or email already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      await UserModel.delete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}
