import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../config/database';

export interface Role {
  id: string;
  name: string;
  description: string;
}

export class RoleModel {
  static async create(role: Omit<Role, 'id'>): Promise<Role> {
    const db = await getDb();
    try {
      const id = uuidv4();
      await db.run(
        'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
        [id, role.name, role.description]
      );
      return { id, ...role };
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Role | null> {
    const db = await getDb();
    try {
      return await db.get('SELECT * FROM roles WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error finding role:', error);
      throw error;
    }
  }

  static async getAll(): Promise<Role[]> {
    const db = await getDb();
    try {
      return await db.all('SELECT * FROM roles');
    } catch (error) {
      console.error('Error getting roles:', error);
      throw error;
    }
  }

  static async getPermissions(roleId: string): Promise<any[]> {
    const db = await getDb();
    try {
      return await db.all(`
        SELECT p.* 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permissionId
        WHERE rp.roleId = ?
      `, [roleId]);
    } catch (error) {
      console.error('Error getting role permissions:', error);
      throw error;
    }
  }
}
