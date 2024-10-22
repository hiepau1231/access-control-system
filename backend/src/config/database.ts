import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

export async function initializeDatabase() {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      email TEXT UNIQUE,
      roleId TEXT,
      FOREIGN KEY (roleId) REFERENCES roles (id)
    );

    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      roleId TEXT,
      permissionId TEXT,
      PRIMARY KEY (roleId, permissionId),
      FOREIGN KEY (roleId) REFERENCES roles (id),
      FOREIGN KEY (permissionId) REFERENCES permissions (id)
    );
  `);

  await db.close();
}
