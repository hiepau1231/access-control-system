import { v4 as uuidv4 } from 'uuid';
import { openDb } from '../config/database';
import { encrypt, decrypt } from '../utils/encryption';

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  roleId: string;
}

export class UserModel {
  static async create(user: Omit<User, 'id'>): Promise<User> {
    const db = await openDb();
    const id = uuidv4();
    const encryptedEmail = encrypt(user.email);
    await db.run(
      'INSERT INTO users (id, username, password, email, roleId) VALUES (?, ?, ?, ?, ?)',
      [id, user.username, user.password, encryptedEmail, user.roleId]
    );
    await db.close();
    return { id, ...user, email: encryptedEmail };
  }

  static async findByUsername(username: string): Promise<User | undefined> {
    const db = await openDb();
    const user = await db.get<User>('SELECT * FROM users WHERE username = ?', [username]);
    await db.close();
    if (user) {
      user.email = decrypt(user.email);
    }
    return user;
  }

  static async findById(id: string): Promise<User | undefined> {
    const db = await openDb();
    const user = await db.get<User>('SELECT * FROM users WHERE id = ?', [id]);
    await db.close();
    if (user) {
      user.email = decrypt(user.email);
    }
    return user;
  }

  static async getAll(): Promise<User[]> {
    const db = await openDb();
    const users = await db.all<User[]>('SELECT * FROM users');
    await db.close();
    return users.map(user => ({ ...user, email: decrypt(user.email) }));
  }

  static async update(id: string, updates: Partial<User>): Promise<void> {
    const db = await openDb();
    const { username, password, email, roleId } = updates;
    const encryptedEmail = email ? encrypt(email) : undefined;
    await db.run(
      'UPDATE users SET username = ?, password = ?, email = ?, roleId = ? WHERE id = ?',
      [username, password, encryptedEmail, roleId, id]
    );
    await db.close();
  }

  static async delete(id: string): Promise<void> {
    const db = await openDb();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    await db.close();
  }
}
