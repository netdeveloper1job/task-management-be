import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateTaskDto } from './dto/request/update-task.dto';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Messages } from 'src/common/constants';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}
  async create(request: CreateTaskDto) {
    try {
      const data = await this.taskRepository.create(request);
      const result = await this.taskRepository.save(data);
      if (!result)
        throw new HttpException(
          `${Messages.Resource.NotFound}: Task`,
          HttpStatus.NOT_FOUND,
        );
      else {
        return {
          message: `${Messages.Resource.Created} : Task`,
          data: result,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async findAll(search: string) {
    const result = await this.taskRepository.find({
      relations: ['user'],
      where: [
        {
          status: Like(`%${search.toLowerCase()}%` as any),
        },
      ],
    });

    if (!result) {
      throw new HttpException(
        `${Messages.Resource.NotFound}: Tasks`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      return {
        message: `${Messages.Resource.Found} : Tasks`,
        data: result,
      };
    }
  }

  async findOne(id: number) {
    const result = await this.taskRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!result)
      throw new HttpException(
        `${Messages.Resource.NotFound}: Task`,
        HttpStatus.NOT_FOUND,
      );
    else {
      return {
        message: `${Messages.Resource.Found} : Task`,
        data: result,
      };
    }
  }

  async update(id: number, request: UpdateTaskDto) {
    const data = await this.taskRepository.findOne({
      where: { id: id },
    });

    if (!data) {
      throw new HttpException(
        `${Messages.Resource.NotFound} : Task`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.taskRepository.update(id, request);
    return {
      message: `${Messages.Resource.Updated} : Task`,
    };
  }

  async remove(id: number) {
    try {
      const deleteData = await this.taskRepository.delete(id);
      if (deleteData.affected > 0) {
        return {
          message: `${Messages.Resource.Deleted} : Task`,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTasksByUserId(id: number, search: string) {
    const result = await this.taskRepository.find({
      where: {
        userId: id,
        status: Like(`%${search.toLowerCase()}%` as any),
      },
      relations: ['user'],
    });
    if (!result)
      throw new HttpException(
        `${Messages.Resource.NotFound}: Task`,
        HttpStatus.NOT_FOUND,
      );
    else {
      return {
        message: `${Messages.Resource.Found} : Task`,
        data: result,
      };
    }
  }

}
