import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { TaskStatus } from '../common/Enums/task.enum';
import { Messages } from '../common/constants';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateTaskDto } from './dto/request/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        userId: 1,
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2023-12-31',
        status: TaskStatus.TODO,
      };

      const savedTask = {
        id: 1,
        ...createTaskDto,
      };

      jest.spyOn(repository, 'create').mockReturnValue(savedTask as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedTask as any);

      const result = await service.create(createTaskDto);

      expect(result).toEqual({
        message: `${Messages.Resource.Created} : Task`,
        data: savedTask,
      });
    });

    it('should throw an exception if task creation fails', async () => {
      const createTaskDto: CreateTaskDto = {
        userId: 1,
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2023-12-31',
        status: TaskStatus.TODO,
      };

      jest.spyOn(repository, 'create').mockReturnValue(createTaskDto as any);
      jest.spyOn(repository, 'save').mockResolvedValue(null);

      await expect(service.create(createTaskDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all tasks matching the search criteria', async () => {
      const tasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          status: 'todo',
          user: {},
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          status: 'done',
          user: {},
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(tasks as any);

      const result = await service.findAll('task');

      expect(result).toEqual({
        message: `${Messages.Resource.Found} : Tasks`,
        data: tasks,
      });
    });

    it('should throw an exception if no tasks are found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(null);

      await expect(service.findAll('task')).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should find a task by ID successfully', async () => {
      const task = {
        id: 1,
        userId: 1,
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2023-12-31',
        status: TaskStatus.TODO,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(task as any);

      const result = await service.findOne(1);

      expect(result).toEqual({
        message: `${Messages.Resource.Found} : Task`,
        data: task,
      });
    });

    it('should throw an exception if task is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated description',
        dueDate: '2023-12-31',
        status: TaskStatus.DONE,
        userId: 1,
      };

      const task = {
        id: 1,
        userId: 1,
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2023-12-31',
        status: TaskStatus.TODO,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(task as any);
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.update(1, updateTaskDto);

      expect(result).toEqual({
        message: `${Messages.Resource.Updated} : Task`,
      });
    });

    it('should throw an exception if task to update is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, {} as UpdateTaskDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task successfully', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove(1);

      expect(result).toEqual({
        message: `${Messages.Resource.Deleted} : Task`,
      });
    });

    it('should throw an exception if task to delete is not found', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(1)).rejects.toThrow(HttpException);
    });
  });

  describe('getTasksByUserId', () => {
    it('should return tasks for a given user ID', async () => {
      const tasks = [
        {
          id: 1,
          userId: 1,
          title: 'Task 1',
          description: 'Description 1',
          status: 'todo',
          user: {},
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(tasks as any);

      const result = await service.getTasksByUserId(1);

      expect(result).toEqual({
        message: `${Messages.Resource.Found} : Task`,
        data: tasks,
      });
    });

    it('should throw an exception if no tasks are found for the user ID', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(null);

      await expect(service.getTasksByUserId(1)).rejects.toThrow(HttpException);
    });
  });

  describe('filterTask', () => {
    it('should return all tasks for a user if filter is "all"', async () => {
      const tasks: Task[] = [
        {
          id: 1,
          userId: 1,
          title: 'Task 1',
          description: 'Description 1',
          dueDate: '2023-12-31',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {},
        } as Task,
      ];

      jest.spyOn(service, 'getTasksByUserId').mockResolvedValue({
        message: `${Messages.Resource.Found} : Task`,
        data: tasks,
      });

      const result = await service.filterTask('all', 1);

      expect(result).toEqual({
        message: `${Messages.Resource.Found} : Task`,
        data: tasks,
      });
    });

    it('should return filtered tasks based on status', async () => {
      const tasks: Task[] = [
        {
          id: 1,
          userId: 1,
          title: 'Task 1',
          description: 'Description 1',
          dueDate: '2023-12-31',
          status: TaskStatus.DONE,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {},
        } as Task,
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(tasks);

      const result = await service.filterTask('done', 1);

      expect(result).toEqual({
        message: `${Messages.Resource.Found} : Task`,
        data: tasks,
      });
    });
  });
  describe('searchInTasks', () => {
    it('should return tasks matching the search query', async () => {
      const tasks = [
        {
          id: 1,
          userId: 1,
          title: 'Task 1',
          description: 'Description 1',
          dueDate: '2023-12-31',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {},
        },
        {
          id: 2,
          userId: 1,
          title: 'Another Task',
          description: 'Description 2',
          dueDate: '2023-12-31',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {},
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(tasks as any);

      const result = await service.searchInTasks(tasks, 'Task');

      expect(result).toEqual({
        message: `${Messages.Resource.Found} : Tasks`,
        data: tasks,
      });
    });
  });
  describe('filterAndSearchTasks', () => {
    it('should return all tasks for a user if filter is "all" and searchQuery is "null"', async () => {
      const tasks: Task[] = [
        {
          id: 1,
          userId: 1,
          title: 'Task 1',
          description: 'Description 1',
          dueDate: '2023-12-31',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {},
        } as Task,
        {
          id: 2,
          userId: 1,
          title: 'Another Task',
          description: 'Description 2',
          dueDate: '2023-12-31',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {},
        } as Task,
      ];

      jest.spyOn(service, 'filterTask').mockResolvedValue({
        message: `${Messages.Resource.Found} : Task`,
        data: tasks,
      });

      const result = await service.filterAndSearchTasks('all', 1, 'null');

      expect(result).toEqual({
        message: `${Messages.Resource.Found} : Task`,
        data: tasks,
      });
    });

    it('should return filtered and searched tasks based on filter and search query', async () => {
      const filteredTasks: Task[] = [
        {
          id: 1,
          userId: 1,
          title: 'Task 1',
          description: 'Description 1',
          dueDate: '2023-12-31',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {},
        } as Task,
        {
          id: 2,
          userId: 1,
          title: 'Another Task',
          description: 'Description 2',
          dueDate: '2023-12-31',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {},
        } as Task,
      ];

      const searchedTasks = [
        {
          id: 1,
          userId: 1,
          title: 'Task 1',
          description: 'Description 1',
          dueDate: '2023-12-31',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {},
        },
      ];

      jest.spyOn(service, 'filterTask').mockResolvedValue({
        message: `${Messages.Resource.Found} : Task`,
        data: filteredTasks,
      });

      jest.spyOn(service, 'searchInTasks').mockResolvedValue({
        message: `${Messages.Resource.Found} : Task`,
        data: searchedTasks,
      });

      const result = await service.filterAndSearchTasks('todo', 1, 'Task 1');

      expect(result).toEqual({
        message: `${Messages.Resource.Found} : Task`,
        data: searchedTasks,
      });
    });

    it('should throw an exception if filterTask fails', async () => {
      jest
        .spyOn(service, 'filterTask')
        .mockRejectedValue(
          new HttpException('Not Found', HttpStatus.NOT_FOUND),
        );

      await expect(
        service.filterAndSearchTasks('all', 1, 'null'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an exception if searchInTasks fails', async () => {
      const filteredTasks = [
        {
          id: 1,
          userId: 1,
          title: 'Task 1',
          description: 'Description 1',
          dueDate: '2023-12-31',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {},
        } as Task,
      ];
      jest.spyOn(service, 'filterTask').mockResolvedValue({
        message: `${Messages.Resource.Found} : Task`,
        data: filteredTasks,
      });
      jest
        .spyOn(service, 'searchInTasks')
        .mockRejectedValue(
          new HttpException('Not Found', HttpStatus.NOT_FOUND),
        );
      await expect(
        service.filterAndSearchTasks('todo', 1, 'Nonexistent Task'),
      ).rejects.toThrow(HttpException);
    });
  });
});
