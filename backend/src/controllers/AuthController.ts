import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../config/database';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra user tồn tại
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Kiểm tra password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, roleId: user.roleId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Trả về response
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra user đã tồn tại
    const existingUser = await db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lấy default role (user role)
    const defaultRole = await db.get('SELECT id FROM roles WHERE name = ?', ['user']);
    if (!defaultRole) {
      return res.status(500).json({ message: 'Default role not found' });
    }

    // Tạo user mới
    const result = await db.run(
      'INSERT INTO users (username, email, password, roleId) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, defaultRole.id]
    );

    // Trả về response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.lastID,
        username,
        email,
        roleId: defaultRole.id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
