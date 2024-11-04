import { Request, Response } from 'express';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { AppDataSource } from '../config/database';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class UserController {
  constructor() {
    // Bind các phương thức với instance
    this.createUser = this.createUser.bind(this);
    this.verifyPassword = this.verifyPassword.bind(this);
    this.encryptPassword = this.encryptPassword.bind(this);
    this.decryptPassword = this.decryptPassword.bind(this);
  }

  private encryptPassword(password: string, secretKey: string): string {
    try {
      // Tạo cipher với secret key
      const cipher = crypto.createCipher('aes-256-cbc', secretKey);
      
      // Mã hóa password
      let encrypted = cipher.update(password, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  private decryptPassword(encryptedPassword: string, secretKey: string): string {
    try {
      // Tạo decipher với secret key
      const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
      
      // Giải mã từ base64
      let decrypted = decipher.update(encryptedPassword, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error('Invalid decryption key');
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find({
        relations: ['role'],
        select: {
          id: true,
          username: true,
          email: true,
          roleId: true,
          encryptedPassword: true,
          role: {
            id: true,
            name: true
          }
        }
      });
      
      res.json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to get users' 
      });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      console.log('Creating user with data:', req.body);
      const userRepository = AppDataSource.getRepository(User);
      const roleRepository = AppDataSource.getRepository(Role);
      
      const { username, password, email, roleId, secretKey } = req.body;
      
      if (!username || !password || !email || !roleId || !secretKey) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      // Kiểm tra role có tồn tại
      const role = await roleRepository.findOneBy({ id: roleId });
      if (!role) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid role' 
        });
      }

      try {
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        const encryptedPassword = this.encryptPassword(password, secretKey);

        // Tạo user mới
        const newUser = userRepository.create({
          username,
          email,
          password: hashedPassword,
          encryptedPassword,
          roleId
        });

        // Lưu user
        const savedUser = await userRepository.save(newUser);

        // Loại bỏ password khỏi response
        const { password: _, ...userResponse } = savedUser;

        res.status(201).json({
          success: true,
          data: userResponse
        });
      } catch (error) {
        console.error('Error in password encryption:', error);
        throw error;
      }
    } catch (error) {
      console.error('Create user error:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user'
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const { id } = req.params;
      const updates = req.body;

      // Kiểm tra user tồn tại
      const user = await userRepository.findOneBy({ id });
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      // Nếu có cập nhật password
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      // Cập nhật user
      await userRepository.update(id, updates);

      res.json({
        success: true,
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update user'
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const { id } = req.params;

      // Kiểm tra user tồn tại
      const user = await userRepository.findOneBy({ id });
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      // Xóa user
      await userRepository.delete(id);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }

  async verifyPassword(req: Request, res: Response) {
    try {
      const { encryptedPassword, secretKey } = req.body;
      const decryptedPassword = this.decryptPassword(encryptedPassword, secretKey);
      
      res.json({
        success: true,
        password: decryptedPassword
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Invalid decryption key'
      });
    }
  }
}