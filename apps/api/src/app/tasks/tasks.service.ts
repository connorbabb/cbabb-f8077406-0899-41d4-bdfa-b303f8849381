import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Organization } from '../entities/organization.entity';
import { CreateTaskDto, UpdateTaskDto, Role } from '@workspace/data';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: any) {
    const task = this.taskRepository.create({
      ...createTaskDto,
      ownerId: user.userId,
      organizationId: user.organizationId,
      status: createTaskDto.status || 'TODO',
    });

    return this.taskRepository.save(task);
  }

  async findAll(user: any) {
    const { userId, organizationId, role } = user;

    // Get accessible org IDs based on role
    const accessibleOrgIds = await this.getAccessibleOrgIds(organizationId, role);

    return this.taskRepository.find({
      where: accessibleOrgIds.map(orgId => ({ organizationId: orgId })),
      relations: ['owner', 'organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: any) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['owner', 'organization'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkAccess(task, user);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: any) {
    const task = await this.findOne(id, user);
    
    // Only owner or admin can edit
    if (user.role === Role.VIEWER) {
      throw new ForbiddenException('Viewers cannot edit tasks');
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string, user: any) {
    const task = await this.findOne(id, user);

    // Only owner or admin can delete
    if (user.role === Role.VIEWER) {
      throw new ForbiddenException('Viewers cannot delete tasks');
    }

    await this.taskRepository.remove(task);
    return { deleted: true };
  }

  private async getAccessibleOrgIds(userOrgId: string, role: Role): Promise<string[]> {
    const orgIds = [userOrgId];

    // Owners can see child org tasks
    if (role === Role.OWNER) {
      const childOrgs = await this.orgRepository.find({
        where: { parentOrgId: userOrgId },
      });
      orgIds.push(...childOrgs.map(org => org.id));
    }

    return orgIds;
  }

  private async checkAccess(task: Task, user: any) {
    const accessibleOrgIds = await this.getAccessibleOrgIds(user.organizationId, user.role);
    
    if (!accessibleOrgIds.includes(task.organizationId)) {
      throw new ForbiddenException('Access denied to this task');
    }
  }
}
