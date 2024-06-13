import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserResponse } from './dto/response/user-response';
import { CreateUserDto } from './dto/request/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Messages } from 'src/common/constants';
import { UserWithResponse } from './dto/response/userWithResponse';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(request: CreateUserDto) {
    try {
      const data = await this.userRepository.create(request);
      const result = await this.userRepository.save(data);
      if (!result)
        throw new HttpException(
          `${Messages.Resource.NotFound}: User`,
          HttpStatus.NOT_FOUND,
        );
      else {
        return {
          message: `${Messages.Resource.Created} : User`,
          data: result,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const result = this.userRepository
        .createQueryBuilder('users')
        .andWhere('users.loggedInType <> :key', {
          key: 'Admin',
        });
      if (!result)
        throw new HttpException(
          `${Messages.Resource.NotFound}: Users`,
          HttpStatus.NOT_FOUND,
        );
      else {
        return {
          message: `${Messages.Resource.Found}: User`,
          data: await result.getMany(),
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.userRepository.findOne({
        where: { id: id },
      });
      if (!result)
        throw new HttpException(
          `${Messages.Resource.NotFound}: User`,
          HttpStatus.NOT_FOUND,
        );
      else {
        return {
          message: `${Messages.Resource.Found} : User`,
          data: result,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, request: UpdateUserDto): Promise<UserWithResponse> {
    const data = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!data) {
      throw new HttpException(
        `${Messages.Resource.NotFound} : User`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepository.update(id, request);
    return {
      message: `${Messages.Resource.Updated} : User`,
    };
  }

  async remove(id: number) {
    try {
      const deleteData = await this.userRepository.delete(id);
      if (deleteData.affected > 0) {
        return {
          message: `${Messages.Resource.Deleted} : User`,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByEmail(email: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
  }
}
