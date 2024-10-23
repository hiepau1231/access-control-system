import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel, User } from '../models/User';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
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
};

export const login = async (req: Request, res: Response) => {
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
};

export const enable2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assume we have middleware to set req.user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const secret = speakeasy.generateSecret();
    user.twoFactorSecret = secret.base32;
    await user.save();

    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: 'Your App',
      issuer: 'Your Company',
    });

    const qrCodeDataUrl = await qrcode.toDataURL(otpAuthUrl);

    res.json({ qrCodeDataUrl, secret: secret.base32 });
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verify2FA = async (req: Request, res: Response) => {
  try {
    const { userId, token } = req.body;
    const user = await User.findByPk(userId);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (verified) {
      user.twoFactorEnabled = true;
      await user.save();
      res.json({ message: '2FA enabled successfully' });
    } else {
      res.status(400).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const disable2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assume we have middleware to set req.user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.twoFactorSecret = null;
    user.twoFactorEnabled = false;
    await user.save();

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
