import { getDb } from './database';
import { v4 as uuidv4 } from 'uuid';

const requiredPermissions = [
  { name: 'delete_role', description: 'Can delete roles' },
  { name: 'create_role', description: 'Can create roles' },
  { name: 'update_role', description: 'Can update roles' },
  { name: 'read_role', description: 'Can read roles' },
  { name: 'manage_role_hierarchy', description: 'Can manage role hierarchy' }
];

export async function ensurePermissions() {
  try {
    const db = await getDb();
    
    // Get admin role
    const adminRole = await db.get('SELECT * FROM roles WHERE name = ?', ['admin']);
    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    // Check and add each required permission
    for (const perm of requiredPermissions) {
      // Check if permission exists
      let permission = await db.get('SELECT * FROM permissions WHERE name = ?', [perm.name]);
      
      // If permission doesn't exist, create it
      if (!permission) {
        const permissionId = uuidv4();
        await db.run(
          'INSERT INTO permissions (id, name, description) VALUES (?, ?, ?)',
          [permissionId, perm.name, perm.description]
        );
        permission = { id: permissionId };
        console.log(`Created permission: ${perm.name}`);
      }

      // Check if admin role has this permission
      const hasPermission = await db.get(
        'SELECT 1 FROM role_permissions WHERE roleId = ? AND permissionId = ?',
        [adminRole.id, permission.id]
      );

      // If admin role doesn't have this permission, assign it
      if (!hasPermission) {
        await db.run(
          'INSERT INTO role_permissions (roleId, permissionId) VALUES (?, ?)',
          [adminRole.id, permission.id]
        );
        console.log(`Assigned permission ${perm.name} to admin role`);
      }
    }

    console.log('Permissions check completed successfully');
  } catch (error) {
    console.error('Error ensuring permissions:', error);
    throw error;
  }
}