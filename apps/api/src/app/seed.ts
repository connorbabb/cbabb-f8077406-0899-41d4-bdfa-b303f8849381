import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import { Task } from './entities/task.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '@workspace/data';

export async function seedDatabase(dataSource: DataSource) {
  const orgRepo = dataSource.getRepository(Organization);
  const userRepo = dataSource.getRepository(User);
  const taskRepo = dataSource.getRepository(Task);

  // Check if database is already seeded
  const existingUser = await userRepo.findOne({ where: { email: 'owner@test.com' } });
  if (existingUser) {
    console.log('✅ Database already seeded, skipping...');
    return;
  }

  // Create organizations
  const parentOrg = orgRepo.create({
    name: 'Parent Corp',
  });
  await orgRepo.save(parentOrg);

  const childOrg = orgRepo.create({
    name: 'Child Division',
    parentOrgId: parentOrg.id,
  });
  await orgRepo.save(childOrg);

  // Create users
  const owner = userRepo.create({
    email: 'owner@test.com',
    password: await bcrypt.hash('password123', 10),
    role: Role.OWNER,
    organizationId: parentOrg.id,
  });

  const admin = userRepo.create({
    email: 'admin@test.com',
    password: await bcrypt.hash('password123', 10),
    role: Role.ADMIN,
    organizationId: childOrg.id,
  });

  const viewer = userRepo.create({
    email: 'viewer@test.com',
    password: await bcrypt.hash('password123', 10),
    role: Role.VIEWER,
    organizationId: childOrg.id,
  });

  await userRepo.save([owner, admin, viewer]);

  // Create sample tasks
  const tasks = [
    taskRepo.create({
      title: 'Setup project',
      description: 'Initialize NX workspace',
      category: 'Work',
      status: 'DONE',
      ownerId: owner.id,
      organizationId: parentOrg.id,
    }),
    taskRepo.create({
      title: 'Review PRs',
      description: 'Review pending pull requests',
      category: 'Work',
      status: 'IN_PROGRESS',
      ownerId: admin.id,
      organizationId: childOrg.id,
    }),
  ];

  await taskRepo.save(tasks);

  console.log('✅ Database seeded successfully!');
}
