import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Role } from '@workspace/data';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text' })
  role: Role;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;
}
