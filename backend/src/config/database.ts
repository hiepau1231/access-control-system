import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

export const initializeDatabase = async () => {
  const db = await open({
    filename: './data/database.sqlite',
    driver: sqlite3.Database
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      roleId TEXT,
      FOREIGN KEY (roleId) REFERENCES roles(id)
    );
  `);

  // Insert default roles if they don't exist
  await db.run(`
    INSERT OR IGNORE INTO roles (id, name, description)
    VALUES 
      ('1', 'admin', 'Administrator'),
      ('2', 'user', 'Regular user')
  `);

  // Create default admin user if not exists
  const adminExists = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(`
      INSERT INTO users (id, username, email, password, roleId)
      VALUES (?, ?, ?, ?, ?)
    `, ['1', 'admin', 'admin@example.com', hashedPassword, '1']);
    console.log('Default admin user created');
  }

  return db;
};

export let db: Awaited<ReturnType<typeof initializeDatabase>>;

export const setupDatabase = async () => {
  db = await initializeDatabase();
};
