import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import fs from 'fs';

let db: Database | null = null;

export async function initDb() {
  if (!db) {
    if (!fs.existsSync('./database.sqlite')) {
      fs.writeFileSync('./database.sqlite', '');
    }

    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');
    
    // Keep connection alive
    setInterval(async () => {
      try {
        await db?.get('SELECT 1');
      } catch (error) {
        console.log('Reconnecting to database...');
        db = await open({
          filename: './database.sqlite',
          driver: sqlite3.Database
        });
      }
    }, 5000);
  }
  return db;
}

export async function getDb() {
  if (!db) {
    db = await initDb();
  }
  return db;
}

export async function initializeDatabase() {
  const database = await getDb();
  
  try {
    // Tạo các bảng...
    await database.exec(`
      CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE,
        description TEXT
      );
    `);

    // Tạo bảng users
    await database.exec(`
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
    await database.exec(`
      CREATE TABLE IF NOT EXISTS permissions (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE,
        description TEXT
      );
    `);

    // Tạo bảng role_permissions
    await database.exec(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        roleId TEXT,
        permissionId TEXT,
        PRIMARY KEY (roleId, permissionId),
        FOREIGN KEY (roleId) REFERENCES roles (id),
        FOREIGN KEY (permissionId) REFERENCES permissions (id)
      );
    `);

    // Insert default role if it doesn't exist
    const defaultRole = await database.get('SELECT * FROM roles WHERE name = ?', ['admin']);
    if (!defaultRole) {
      const roleId = uuidv4();
      await database.run(
        'INSERT INTO roles (id, name, description) VALUES (?, ?, ?)',
        [roleId, 'admin', 'Administrator role with full access']
      );

      // Create default permissions
      const permissions = [
        { id: uuidv4(), name: 'read:users', description: 'Can read users' },
        { id: uuidv4(), name: 'create:users', description: 'Can create users' },
        { id: uuidv4(), name: 'update:users', description: 'Can update users' },
        { id: uuidv4(), name: 'delete:users', description: 'Can delete users' },
        { id: uuidv4(), name: 'read:roles', description: 'Can read roles' },
        { id: uuidv4(), name: 'create:roles', description: 'Can create roles' },
        { id: uuidv4(), name: 'update:roles', description: 'Can update roles' },
        { id: uuidv4(), name: 'delete:roles', description: 'Can delete roles' },
        { id: uuidv4(), name: 'read:permissions', description: 'Can read permissions' },
        { id: uuidv4(), name: 'create:permissions', description: 'Can create permissions' },
        { id: uuidv4(), name: 'update:permissions', description: 'Can update permissions' },
        { id: uuidv4(), name: 'delete:permissions', description: 'Can delete permissions' }
      ];

      for (const perm of permissions) {
        await database.run(
          'INSERT INTO permissions (id, name, description) VALUES (?, ?, ?)',
          [perm.id, perm.name, perm.description]
        );

        // Assign permission to admin role
        await database.run(
          'INSERT INTO role_permissions (roleId, permissionId) VALUES (?, ?)',
          [roleId, perm.id]
        );
      }

      // Create admin user with password: admin123
      const adminPassword = await bcrypt.hash('admin123', 10);
      const adminId = uuidv4();
      await database.run(
        'INSERT INTO users (id, username, email, password, roleId) VALUES (?, ?, ?, ?, ?)',
        [adminId, 'admin', 'admin@example.com', adminPassword, roleId]
      );

      console.log('Admin role, permissions and admin user created');
    }

    console.log('Database initialized successfully');

    await database.exec(`
      CREATE TABLE IF NOT EXISTS role_hierarchy (
        parent_role_id TEXT NOT NULL,
        child_role_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (parent_role_id, child_role_id),
        FOREIGN KEY (parent_role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (child_role_id) REFERENCES roles(id) ON DELETE CASCADE
      );
    `);
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Cleanup function for graceful shutdown
process.on('SIGINT', async () => {
  try {
    if (db) {
      await db.close();
      console.log('Database connection closed.');
    }
  } catch (error) {
    console.error('Error closing database:', error);
  } finally {
    process.exit(0);
  }
});

// Export functions
export default {
  getDb,
  initDb,
  initializeDatabase
};
