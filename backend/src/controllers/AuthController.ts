import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel, User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password, email, roleId } = req.body;

      // Kiểm tra xem username đã tồn tại chưa
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo user mới
      const newUser = await UserModel.create({
        username,
        password: hashedPassword,
        email,
        roleId,
      });

      res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Tìm user theo username
      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Tạo JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username, roleId: user.roleId },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
