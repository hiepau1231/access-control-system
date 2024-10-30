import { DataSource } from 'typeorm';
import path from 'path';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import bcrypt from 'bcrypt';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../../data/database.sqlite'),
  entities: [User, Role, Permission],
  synchronize: true,
  logging: true
});

export const setupDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized');

    const roleRepository = AppDataSource.getRepository(Role);
    const userRepository = AppDataSource.getRepository(User);

    // Seed default roles if not exist
    let userRole = await roleRepository.findOne({ where: { name: 'user' } });
    if (!userRole) {
      userRole = await roleRepository.save({
        name: 'user',
        description: 'Default user role'
      });
      console.log('Default user role created');
    }

    let adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      adminRole = await roleRepository.save({
        name: 'admin',
        description: 'Administrator role'
      });
      console.log('Admin role created');
    }

    // Seed admin user if not exists
    const adminUser = await userRepository.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await userRepository.save({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        roleId: adminRole.id
      });
      console.log('Admin user created');
    }

    // Seed test user if not exists
    const testUser = await userRepository.findOne({ where: { username: 'test' } });
    if (!testUser) {
      const hashedPassword = await bcrypt.hash('test', 10);
      await userRepository.save({
        username: 'test',
        password: hashedPassword,
        email: 'test@example.com',
        roleId: userRole.id
      });
      console.log('Test user created');
    }

  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};
