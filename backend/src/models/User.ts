import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './Role';
import { AppDataSource } from '../config/database';
import bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  roleId: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}

export class UserModel {
  static async getAll(): Promise<User[]> {
    const repository = AppDataSource.getRepository(User);
    return repository.find({
      relations: ['role']
    });
  }

  static async findById(id: string): Promise<User | null> {
    const repository = AppDataSource.getRepository(User);
    return repository.findOne({
      where: { id },
      relations: ['role']
    });
  }

  static async findByUsername(username: string): Promise<User | null> {
    const repository = AppDataSource.getRepository(User);
    return repository.findOne({
      where: { username },
      relations: ['role']
    });
  }

  static async create(data: Partial<User>): Promise<User> {
    const repository = AppDataSource.getRepository(User);
    
    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    const user = repository.create(data);
    return repository.save(user);
  }

  static async update(id: string, data: Partial<User>): Promise<User | null> {
    const repository = AppDataSource.getRepository(User);
    
    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    await repository.update(id, data);
    return this.findById(id);
  }

  static async delete(id: string): Promise<void> {
    const repository = AppDataSource.getRepository(User);
    await repository.delete(id);
  }

  static async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}