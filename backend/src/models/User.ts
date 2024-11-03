import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './Role';
import { AppDataSource } from '../config/database';
import * as crypto from 'crypto';

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

  @Column({ nullable: true })
  encryptedPassword: string;

  static encryptPassword(password: string): string {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from('your-secret-key-32-chars-required!', 'utf-8');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }
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
      data.password = User.encryptPassword(data.password);
    }
    
    const user = repository.create(data);
    return repository.save(user);
  }

  static async update(id: string, data: Partial<User>): Promise<User | null> {
    const repository = AppDataSource.getRepository(User);
    
    // Hash password if provided
    if (data.password) {
      data.password = User.encryptPassword(data.password);
    }
    
    await repository.update(id, data);
    return this.findById(id);
  }

  static async delete(id: string): Promise<void> {
    const repository = AppDataSource.getRepository(User);
    await repository.delete(id);
  }

  static async validatePassword(user: User, password: string): Promise<boolean> {
    const [iv, encryptedPassword] = user.password.split(':');
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from('your-secret-key-32-chars-required!', 'utf-8');
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted === password;
  }
}