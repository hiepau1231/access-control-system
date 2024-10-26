import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { getDb } from '../config/database';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      console.log('Login attempt:', { username });

      const db = await getDb();
      
      // Get user with role
      const user = await db.get(`
        SELECT u.*, r.name as roleName 
        FROM users u 
        JOIN roles r ON u.roleId = r.id 
        WHERE u.username = ?
      `, [username]);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Password validation:', { isValid: isValidPassword });

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          email: user.email,
          roleId: user.roleId,
          roleName: user.roleName
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Return user info and token
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          roleId: user.roleId,
          roleName: user.roleName
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Create new user with default role
      const user = await UserModel.create({
        username,
        email,
        password,
        roleId: 'default' // We need to ensure this default role exists
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error during registration' });
    }
  }
}
