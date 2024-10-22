import { v4 as uuidv4 } from 'uuid';
import { openDb } from '../config/database';

export interface Role {
  id: string;
  name: string;
  description: string;
}

export class RoleModel {
  static async create(role: Omit<Role, 'id'>): Promise<Role> {
    const db = await openDb();
    const id = uuidv4();
    await db.run(
      'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
      [id, role.name, role.description]
    );
    await db.close();
    return { id, ...role };
  }

  static async findById(id: string): Promise<Role | undefined> {
    const db = await openDb();
    const role = await db.get<Role>('SELECT * FROM roles WHERE id = ?', [id]);
    await db.close();
    return role;
  }

  static async getAll(): Promise<Role[]> {
    const db = await openDb();
    const roles = await db.all<Role[]>('SELECT * FROM roles');
    await db.close();
    return roles;
  }

  static async update(id: string, updates: Partial<Role>): Promise<void> {
    const db = await openDb();
    const { name, description } = updates;
    await db.run(
      'UPDATE roles SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    await db.close();
  }

  static async delete(id: string): Promise<void> {
    const db = await openDb();
    await db.run('DELETE FROM roles WHERE id = ?', [id]);
    await db.close();
  }
}
