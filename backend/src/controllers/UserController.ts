import { Request, Response } from 'express';
import { User } from '../models/User';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { decrypt } from '../utils/encryption';

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let whereClause = {};
      if (search) {
        whereClause = {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        };
      }

      const users = await User.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset: offset,
        attributes: ['id', 'username', 'email', 'roleId']
      });

      res.json({
        total: users.count,
        users: users.rows,
        currentPage: Number(page),
        totalPages: Math.ceil(users.count / Number(limit))
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id);
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

      await User.update(req.params.id, updates);
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
      await User.delete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}
