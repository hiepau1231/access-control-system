import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { getDb } from '../config/database';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roleId: string;
}

export class UserModel {
  static async getAll(): Promise<User[]> {
    const db = await getDb();
    try {
      return await db.all('SELECT * FROM users');
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<User | null> {
    const db = await getDb();
    try {
      return await db.get('SELECT * FROM users WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  static async findByUsername(username: string): Promise<User | null> {
    const db = await getDb();
    try {
      return await db.get('SELECT * FROM users WHERE username = ?', [username]);
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  static async create(data: Omit<User, 'id'>): Promise<User> {
    const db = await getDb();
    try {
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await db.run(
        'INSERT INTO users (id, username, email, password, roleId) VALUES (?, ?, ?, ?, ?)',
        [id, data.username, data.email, hashedPassword, data.roleId]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<User>): Promise<void> {
    const db = await getDb();
    const { username, email, password, roleId } = updates;
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.run(
        'UPDATE users SET username = ?, email = ?, password = ?, roleId = ? WHERE id = ?',
        [username, email, hashedPassword, roleId, id]
      );
    } else {
      await db.run(
        'UPDATE users SET username = ?, email = ?, roleId = ? WHERE id = ?',
        [username, email, roleId, id]
      );
    }
    
    await db.close();
  }

  static async delete(id: string): Promise<void> {
    const db = await getDb();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    await db.close();
  }

  static async comparePassword(user: User, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, user.password);
  }
}
