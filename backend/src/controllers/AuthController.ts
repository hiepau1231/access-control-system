import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { getDb } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

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

      const db = await getDb();

      // Check if user already exists
      const existingUser = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      // Get default role (user role)
      const userRole = await db.get('SELECT id FROM roles WHERE name = ?', ['user']);
      if (!userRole) {
        // Create user role if it doesn't exist
        const roleId = uuidv4();
        await db.run(
          'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
          [roleId, 'user', 'Default user role']
        );

        // Create new user with hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        await db.run(
          'INSERT INTO users (id, username, email, password, roleId) VALUES (?, ?, ?, ?, ?)',
          [userId, username, email, hashedPassword, roleId]
        );

        res.status(201).json({
          message: 'User registered successfully',
          user: {
            id: userId,
            username,
            email,
            roleId
          }
        });
      } else {
        // Create new user with existing user role
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        await db.run(
          'INSERT INTO users (id, username, email, password, roleId) VALUES (?, ?, ?, ?, ?)',
          [userId, username, email, hashedPassword, userRole.id]
        );

        res.status(201).json({
          message: 'User registered successfully',
          user: {
            id: userId,
            username,
            email,
            roleId: userRole.id
          }
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error during registration' });
    }
  }
}
