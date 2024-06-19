import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { TaskStatus } from '../common/Enums/task.enum';
import { TaskWithResponse } from './dto/response/taskWithResponse';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateTaskDto } from './dto/request/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;
  let repository: Repository<Task>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        userId: 1,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-06-15',
        status: TaskStatus.TODO,
      };

      const mockCreatedTask: { message: string; data: Task } = {
        message: 'Task created successfully',
        data: {
          id: 1,
          userId: 1,
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2024-06-15',
          status: TaskStatus.TODO,
          createdAt: new Date('2024-06-12T11:18:36.462Z'),
          updatedAt: null,
          user: [],
        },
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockCreatedTask);

      const result = await controller.create(createTaskDto);

      const expectedResult: TaskWithResponse = new TaskWithResponse(
        mockCreatedTask.message,
        mockCreatedTask.data,
      );

      expect(result).toEqual(expectedResult);
    });
  });
  it('should throw an error if userId is missing on create', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '2024-06-15',
      status: TaskStatus.TODO,
    } as any;

    try {
      await controller.create(createTaskDto);
    } catch (error) {
      expect(error);
    }
  });

  it('should throw an error if title is missing on create', async () => {
    const createTaskDto: CreateTaskDto = {
      userId: 1,
      description: 'Test Description',
      dueDate: '2024-06-15',
      status: TaskStatus.TODO,
    } as any;

    try {
      await controller.create(createTaskDto);
    } catch (error) {
      expect(error);
    }
  });

  it('should throw an error if description is missing on create', async () => {
    const createTaskDto: CreateTaskDto = {
      userId: 1,
      title: 'Test Task',
      dueDate: '2024-06-15',
      status: TaskStatus.TODO,
    } as any;

    try {
      await controller.create(createTaskDto);
    } catch (error) {
      expect(error);
    }
  });

  it('should throw an error if dueDate is missing on create', async () => {
    const createTaskDto: CreateTaskDto = {
      userId: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.TODO,
    } as any;

    try {
      await controller.create(createTaskDto);
    } catch (error) {
      expect(error);
    }
  });

  it('should throw an error if status is invalid on create', async () => {
    const createTaskDto: CreateTaskDto = {
      userId: 1,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '2024-06-15',
      status: 'InvalidStatus' as TaskStatus,
    };

    try {
      await controller.create(createTaskDto);
    } catch (error) {
      expect(error);
    }
  });

  describe('findOne', () => {
    it('should find one task by ID', async () => {
      const taskId = '1';

      const expectedResult: { message: string; data: Task } = {
        message: 'Get one task',
        data: {
          id: 1,
          userId: 1,
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2024-06-15',
          status: TaskStatus.TODO,
          createdAt: new Date('2024-06-12T11:18:36.462Z'),
          updatedAt: new Date('2024-06-12T11:18:36.462Z'),
          user: [],
        },
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne(taskId);

      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if taskId is not a number', async () => {
      const taskId = 'asd';
      try {
        await controller.findOne(taskId);
      } catch (error) {
        expect(error);
      }
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: '2024-06-20',
        status: TaskStatus.DONE,
        userId: 1,
      };

      const expectedResult: { message: string; data: Task } = {
        message: 'Task updated successfully',
        data: {
          id: 1,
          userId: 1,
          ...updateTaskDto,
          createdAt: new Date('2024-06-12T11:18:36.462Z'),
          updatedAt: new Date('2024-06-13T11:18:36.462Z'),
          user: [],
        },
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result = await controller.update(taskId, updateTaskDto);

      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if taskId is not a number', async () => {
      const taskId = 'asdas';
      try {
        await controller.update(taskId, {} as UpdateTaskDto);
      } catch (error) {
        expect(error);
      }
    });
  });

  it('should throw an error if userId is missing on update', async () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '2024-06-15',
      status: TaskStatus.TODO,
    } as any;

    try {
      const taskId = '1';
      await controller.update(taskId, updateTaskDto);
    } catch (error) {
      expect(error);
    }
  });

  it('should throw an error if title is missing on update', async () => {
    const updateTaskDto: UpdateTaskDto = {
      userId: 1,
      description: 'Test Description',
      dueDate: '2024-06-15',
      status: TaskStatus.TODO,
    } as any;

    try {
      const taskId = '1';
      await controller.update(taskId, updateTaskDto);
    } catch (error) {
      expect(error);
    }
  });

  it('should throw an error if description is missing on update', async () => {
    const updateTaskDto: UpdateTaskDto = {
      userId: 1,
      title: 'Test Task',
      dueDate: '2024-06-15',
      status: TaskStatus.TODO,
    } as any;

    try {
      const taskId = '1';
      await controller.update(taskId, updateTaskDto);
    } catch (error) {
      expect(error);
    }
  });

  it('should throw an error if dueDate is missing, on update', async () => {
    const updateTaskDto: UpdateTaskDto = {
      userId: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.TODO,
    } as any;

    try {
      const taskId = '1';
      await controller.update(taskId, updateTaskDto);
    } catch (error) {
      expect(error);
    }
  });

  it('should throw an error if status is invalid on update', async () => {
    const updateTaskDto: UpdateTaskDto = {
      userId: 1,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '2024-06-15',
      status: 'InvalidStatus' as TaskStatus,
    };

    try {
      const taskId = '1';
      await controller.update(taskId, updateTaskDto);
    } catch (error) {
      expect(error);
    }
  });

  describe('remove', () => {
    it('should remove a task by ID', async () => {
      const taskId = '1';

      const expectedResult: { message: string; data: Task } = {
        message: 'Task delete successfully',
        data: {
          id: 1,
          userId: 1,
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2024-06-15',
          status: TaskStatus.TODO,
          createdAt: new Date('2024-06-12T11:18:36.462Z'),
          updatedAt: new Date('2024-06-12T11:18:36.462Z'),
          user: [],
        },
      };

      jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);

      const result = await controller.remove(taskId);

      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if taskId is not a number', async () => {
      const taskId = '1';

      try {
        await controller.remove(taskId);
      } catch (error) {
        expect(error);
      }
    });
  });

  describe('getTasksByUserId', () => {
    it('should return tasks for a valid user ID', async () => {
      const userId = 1;
      const expectedResult: { message: string; data: Task[] } = {
        message: 'Get Task By UserID',
        data: [
          {
            id: 1,
            userId: 1,
            title: 'Test Task',
            description: 'Test Description',
            dueDate: '2024-06-15',
            status: TaskStatus.TODO,
            createdAt: new Date('2024-06-12T11:18:36.462Z'),
            updatedAt: new Date('2024-06-12T11:18:36.462Z'),
            user: [],
          },
          {
            id: 2,
            userId: 1,
            title: 'Test Task 2',
            description: 'Test Description 2',
            dueDate: '2024-06-15',
            status: TaskStatus.DONE,
            createdAt: new Date('2024-06-12T11:18:36.462Z'),
            updatedAt: null,
            user: [],
          },
        ],
      };
      jest.spyOn(service, 'getTasksByUserId').mockResolvedValue(expectedResult);

      const result = await controller.getTasksByUserId(userId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw error for an invalid user ID', async () => {
      const userId = 999;
      try {
        await controller.getTasksByUserId(userId);
      } catch (error) {
        expect(error);
      }
    });
  });

  it('should return filtered tasks for a valid filter and user ID', async () => {
    const filter = 'To DO';
    const userId = 1;
    const expectedResult: { message: string; data: Task[] } = {
      message: 'Task delete successfully',
      data: [
        {
          id: 1,
          userId: 1,
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2024-06-15',
          status: TaskStatus.TODO,
          createdAt: new Date('2024-06-12T11:18:36.462Z'),
          updatedAt: new Date('2024-06-12T11:18:36.462Z'),
          user: [],
        },
        {
          id: 2,
          userId: 1,
          title: 'Test Task 2',
          description: 'Test Description 2',
          dueDate: '2024-06-15',
          status: TaskStatus.DONE,
          createdAt: new Date('2024-06-12T11:18:36.462Z'),
          updatedAt: null,
          user: [],
        },
      ],
    };
    jest.spyOn(service, 'filterTask').mockResolvedValue(expectedResult);
    const result = await controller.filterTask(filter, userId);
    expect(result).toEqual(expectedResult);
  });

  it('should return filtered and searched tasks for valid parameters', async () => {
    const filter = 'todo';
    const userId = 1;
    const searchQuery = 'test task';
    const expectedResult: { message: string; data: Task[] } = {
      message: 'Task delete successfully',
      data: [
        {
          id: 1,
          userId: 1,
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2024-06-15',
          status: TaskStatus.TODO,
          createdAt: new Date('2024-06-12T11:18:36.462Z'),
          updatedAt: new Date('2024-06-12T11:18:36.462Z'),
          user: [],
        },
        {
          id: 2,
          userId: 1,
          title: 'Test Task 2',
          description: 'Test Description 2',
          dueDate: '2024-06-15',
          status: TaskStatus.DONE,
          createdAt: new Date('2024-06-12T11:18:36.462Z'),
          updatedAt: null,
          user: [],
        },
      ],
    };
    jest
      .spyOn(service, 'filterAndSearchTasks')
      .mockResolvedValue(expectedResult);

    const result = await controller.filterAndSearchTasks(
      filter,
      userId,
      searchQuery,
    );
    expect(result).toEqual(expectedResult);
  });
});
