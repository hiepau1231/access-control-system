import { getDb } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export class PermissionModel {
  static async create(data: Omit<Permission, 'id'>): Promise<Permission> {
    const db = await getDb();
    try {
      const id = uuidv4();
      await db.run(
        'INSERT INTO permissions (id, name, description) VALUES (?, ?, ?)',
        [id, data.name, data.description]
      );
      return { id, ...data };
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Permission | null> {
    const db = await getDb();
    try {
      return await db.get('SELECT * FROM permissions WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error finding permission:', error);
      throw error;
    }
  }

  static async getAll(): Promise<Permission[]> {
    const db = await getDb();
    try {
      return await db.all('SELECT * FROM permissions');
    } catch (error) {
      console.error('Error getting permissions:', error);
      throw error;
    }
  }

  static async assignToRole(roleId: string, permissionId: string): Promise<void> {
    const db = await getDb();
    await db.run(
      'INSERT INTO role_permissions (roleId, permissionId) VALUES (?, ?)',
      [roleId, permissionId]
    );
    await db.close();
  }

  static async getRolePermissions(roleId: string): Promise<string[]> {
    const db = await getDb();
    const permissions = await db.all<{permissionId: string}[]>(
      'SELECT permissionId FROM role_permissions WHERE roleId = ?',
      [roleId]
    );
    await db.close();
    return permissions.map(p => p.permissionId);
  }
}
