import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import fs from 'fs';

export async function openDb() {
  // Đảm bảo file database tồn tại
  if (!fs.existsSync('./database.sqlite')) {
    fs.writeFileSync('./database.sqlite', '');
  }

  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

export async function initializeDatabase() {
  const db = await openDb();

  try {
    // Tạo bảng roles trước vì users có foreign key reference đến roles
    await db.exec(`
      CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE,
        description TEXT
      );
    `);

    // Tạo bảng users
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT UNIQUE,
        roleId TEXT,
        FOREIGN KEY (roleId) REFERENCES roles (id)
      );
    `);

    // Tạo bảng permissions
    await db.exec(`
      CREATE TABLE IF NOT EXISTS permissions (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE,
        description TEXT
      );
    `);

    // Tạo bảng role_permissions
    await db.exec(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        roleId TEXT,
        permissionId TEXT,
        PRIMARY KEY (roleId, permissionId),
        FOREIGN KEY (roleId) REFERENCES roles (id),
        FOREIGN KEY (permissionId) REFERENCES permissions (id)
      );
    `);

    // Insert default role if it doesn't exist
    const defaultRole = await db.get('SELECT * FROM roles WHERE name = ?', ['user']);
    if (!defaultRole) {
      const roleId = 'default';
      await db.run(
        'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
        [roleId, 'user', 'Default user role']
      );

      // Create default permissions
      const permissions = [
        { id: uuidv4(), name: 'read:users', description: 'Can read users' },
        { id: uuidv4(), name: 'create:users', description: 'Can create users' },
        { id: uuidv4(), name: 'update:users', description: 'Can update users' },
        { id: uuidv4(), name: 'delete:users', description: 'Can delete users' }
      ];

      for (const perm of permissions) {
        await db.run(
          'INSERT INTO permissions (id, name, description) VALUES (?, ?, ?)',
          [perm.id, perm.name, perm.description]
        );

        // Assign permission to default role
        await db.run(
          'INSERT INTO role_permissions (roleId, permissionId) VALUES (?, ?)',
          [roleId, perm.id]
        );
      }

      // Create a default admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      await db.run(
        'INSERT OR IGNORE INTO users (id, username, email, password, roleId) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), 'admin', 'admin@example.com', adminPassword, roleId]
      );

      console.log('Default role, permissions and admin user created');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    await db.close();
  }
}
