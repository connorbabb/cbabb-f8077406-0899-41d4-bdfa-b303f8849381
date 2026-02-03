import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  parentOrgId: string;

  @ManyToOne(() => Organization, { nullable: true })
  parentOrg: Organization;

  @CreateDateColumn()
  createdAt: Date;
}
