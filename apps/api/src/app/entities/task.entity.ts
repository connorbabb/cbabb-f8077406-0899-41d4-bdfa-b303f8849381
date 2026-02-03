import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 'TODO' })
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';

  @Column()
  category: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => User)
  owner: User;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
