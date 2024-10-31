import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './Role';

@Entity('role_hierarchy')
export class RoleHierarchy {
  @PrimaryColumn()
  parent_role_id: string;

  @PrimaryColumn()
  child_role_id: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'parent_role_id' })
  parentRole: Role;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'child_role_id' })
  childRole: Role;
}