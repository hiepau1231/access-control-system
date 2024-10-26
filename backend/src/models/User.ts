import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { openDb } from '../config/database';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roleId: string;
}

export class UserModel {
  static async create(user: Omit<User, 'id'>): Promise<User> {
    const db = await openDb();
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    await db.run(
      'INSERT INTO users (id, username, email, password, roleId) VALUES (?, ?, ?, ?, ?)',
      [id, user.username, user.email, hashedPassword, user.roleId]
    );
    
    await db.close();
    return { id, ...user, password: hashedPassword };
  }

  static async findByUsername(username: string): Promise<User | undefined> {
    const db = await openDb();
    const user = await db.get<User>('SELECT * FROM users WHERE username = ?', [username]);
    await db.close();
    return user;
  }

  static async findById(id: string): Promise<User | undefined> {
    const db = await openDb();
    const user = await db.get<User>('SELECT * FROM users WHERE id = ?', [id]);
    await db.close();
    return user;
  }

  static async getAll(): Promise<User[]> {
    const db = await openDb();
    const users = await db.all<User[]>('SELECT * FROM users');
    await db.close();
    return users;
  }

  static async update(id: string, updates: Partial<User>): Promise<void> {
    const db = await openDb();
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
    const db = await openDb();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    await db.close();
  }

  static async comparePassword(user: User, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, user.password);
  }
}
