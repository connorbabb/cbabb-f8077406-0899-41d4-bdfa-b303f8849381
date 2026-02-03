import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '@workspace/data';

describe('TasksService', () => {
  let service: TasksService;
  let mockTaskRepo: any;
  let mockOrgRepo: any;

  beforeEach(async () => {
    mockTaskRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    mockOrgRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTaskRepo },
        { provide: getRepositoryToken(Organization), useValue: mockOrgRepo },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should create a task', async () => {
    const user = { userId: '1', organizationId: 'org1', role: Role.ADMIN };
    const dto = { title: 'Test', description: 'Test task', category: 'Work' };
    const createdTask = { ...dto, id: '1', status: 'TODO', ownerId: user.userId, organizationId: user.organizationId, createdAt: new Date(), updatedAt: new Date() } as any;
    
    mockTaskRepo.create.mockReturnValue(createdTask);
    mockTaskRepo.save.mockResolvedValue(createdTask);

    const result = await service.create(dto, user);
    expect(result).toBeDefined();
    expect((result as any).title).toBe('Test');
  });

  it('should scope tasks by organization for viewer', async () => {
    const user = { userId: '1', organizationId: 'org1', role: Role.VIEWER };
    
    mockOrgRepo.find.mockResolvedValue([]);
    mockTaskRepo.find.mockResolvedValue([]);

    await service.findAll(user);
    
    expect(mockTaskRepo.find).toHaveBeenCalled();
  });

  it('should allow owner to see child org tasks', async () => {
    const user = { userId: '1', organizationId: 'org1', role: Role.OWNER };
    
    mockOrgRepo.find.mockResolvedValue([{ id: 'org2', parentOrgId: 'org1' }]);
    mockTaskRepo.find.mockResolvedValue([]);

    await service.findAll(user);
    
    expect(mockOrgRepo.find).toHaveBeenCalledWith({ where: { parentOrgId: 'org1' } });
  });
});
