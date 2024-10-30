import { DataSource } from 'typeorm';
import path from 'path';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

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

    // Seed default role if not exists
    const roleRepository = AppDataSource.getRepository(Role);
    let userRole = await roleRepository.findOne({ where: { name: 'user' } });
    if (!userRole) {
      userRole = await roleRepository.save({
        name: 'user',
        description: 'Default user role'
      });
      console.log('Default role created');
    }

    // Seed test user if not exists
    const userRepository = AppDataSource.getRepository(User);
    const testUser = await userRepository.findOne({ where: { username: 'test' } });
    if (!testUser) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('test', 10);
      await userRepository.save({
        username: 'test',
        password: hashedPassword,
        email: 'test@example.com',
        roleId: userRole.id
      });
      console.log('Test user created with role:', userRole.name);
    }

  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};
