import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AppDataSource } from '../config/database';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ 
    type: 'varchar',
    default: 'system_settings',
    enum: [
      'user_management',
      'role_management',
      'permission_management',
      'content_management',
      'system_settings',
      'reporting',
      'audit_logs'
    ]
  })
  category: string;
}

export class PermissionModel {
  static async getAll(): Promise<Permission[]> {
    const repository = AppDataSource.getRepository(Permission);
    return repository.find();
  }

  static async findById(id: string): Promise<Permission | null> {
    const repository = AppDataSource.getRepository(Permission);
    return repository.findOneBy({ id });
  }

  static async create(data: Partial<Permission>): Promise<Permission> {
    const repository = AppDataSource.getRepository(Permission);
    const permission = repository.create({
      ...data,
      category: data.category || 'system_settings' // Default category if not provided
    });
    return repository.save(permission);
  }

  static async update(id: string, data: Partial<Permission>): Promise<Permission | null> {
    const repository = AppDataSource.getRepository(Permission);
    await repository.update(id, data);
    return this.findById(id);
  }

  static async delete(id: string): Promise<void> {
    const repository = AppDataSource.getRepository(Permission);
    await repository.delete(id);
  }

  static async assignToRole(roleId: string, permissionId: string): Promise<void> {
    const repository = AppDataSource.getRepository('role_permissions');
    await repository.save({ roleId, permissionId });
  }

  static async getRolePermissions(roleId: string): Promise<string[]> {
    const repository = AppDataSource.getRepository('role_permissions');
    const permissions = await repository.find({ where: { roleId } });
    return permissions.map(p => p.permissionId);
  }

  // Thêm phương thức để cập nhật category cho permissions hiện có
  static async updateExistingPermissionsCategories(): Promise<void> {
    const repository = AppDataSource.getRepository(Permission);
    const permissions = await repository.find();

    // Map permissions to categories based on their names
    const categoryMap: { [key: string]: string } = {
      'user': 'user_management',
      'role': 'role_management',
      'permission': 'permission_management',
      'content': 'content_management',
      'system': 'system_settings',
      'report': 'reporting',
      'audit': 'audit_logs'
    };

    for (const permission of permissions) {
      let category = 'system_settings'; // Default category
      
      // Determine category based on permission name
      for (const [key, value] of Object.entries(categoryMap)) {
        if (permission.name.includes(key)) {
          category = value;
          break;
        }
      }

      // Update permission if it doesn't have a category
      if (!permission.category) {
        await repository.update(permission.id, { category });
      }
    }
  }
}