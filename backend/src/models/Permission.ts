import { v4 as uuidv4 } from 'uuid';
import { openDb } from '../config/database';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export class PermissionModel {
  static async create(permission: Omit<Permission, 'id'>): Promise<Permission> {
    const db = await openDb();
    const id = uuidv4();
    await db.run(
      'INSERT INTO permissions (id, name, description) VALUES (?, ?, ?)',
      [id, permission.name, permission.description]
    );
    await db.close();
    return { id, ...permission };
  }

  static async findById(id: string): Promise<Permission | undefined> {
    const db = await openDb();
    const permission = await db.get<Permission>('SELECT * FROM permissions WHERE id = ?', [id]);
    await db.close();
    return permission;
  }

  static async getAll(): Promise<Permission[]> {
    const db = await openDb();
    const permissions = await db.all<Permission[]>('SELECT * FROM permissions');
    await db.close();
    return permissions;
  }

  static async update(id: string, updates: Partial<Permission>): Promise<void> {
    const db = await openDb();
    const { name, description } = updates;
    await db.run(
      'UPDATE permissions SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    await db.close();
  }

  static async delete(id: string): Promise<void> {
    const db = await openDb();
    await db.run('DELETE FROM permissions WHERE id = ?', [id]);
    await db.close();
  }

  static async assignToRole(roleId: string, permissionId: string): Promise<void> {
    const db = await openDb();
    await db.run(
      'INSERT INTO role_permissions (roleId, permissionId) VALUES (?, ?)',
      [roleId, permissionId]
    );
    await db.close();
  }

  static async removeFromRole(roleId: string, permissionId: string): Promise<void> {
    const db = await openDb();
    await db.run(
      'DELETE FROM role_permissions WHERE roleId = ? AND permissionId = ?',
      [roleId, permissionId]
    );
    await db.close();
  }

  static async getPermissionsForRole(roleId: string): Promise<Permission[]> {
    const db = await openDb();
    const permissions = await db.all<Permission[]>(
      `SELECT p.* FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permissionId
       WHERE rp.roleId = ?`,
      [roleId]
    );
    await db.close();
    return permissions;
  }
}
