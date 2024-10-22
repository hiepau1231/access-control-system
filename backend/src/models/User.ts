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

  static async getAll(page: number, limit: number, search?: string): Promise<{ users: User[], total: number }> {
    const db = await openDb();
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM users';
    let countQuery = 'SELECT COUNT(*) as count FROM users';
    const params = [];

    if (search) {
      query += ' WHERE username LIKE ? OR email LIKE ?';
      countQuery += ' WHERE username LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const users = await db.all<User[]>(query, params);
    const [{ count }] = await db.all(countQuery, search ? [`%${search}%`, `%${search}%`] : []);

    await db.close();
    return {
      users: users.map(user => ({ ...user, email: decrypt(user.email) })),
      total: count
    };
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
