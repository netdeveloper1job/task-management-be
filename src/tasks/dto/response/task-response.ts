import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TaskStatus } from 'src/common/Enums/task.enum';
import { TransformDateToEpoch } from 'src/common/helper/decorators/transformDateToEpoch';
import { PrimaryGeneratedColumn } from 'typeorm';

export class TaskResponse {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  
  @Expose()
  userId: string;
  
  @Expose()
  title: string;
  
  @Expose()
  description: string;
  
  @Expose()
  dueDate: string;
  
  @ApiProperty({ example: TaskStatus })
  @Expose()
  status: string;
  
  @ApiPropertyOptional({ example: Date.now() / 1000 })
  @TransformDateToEpoch()
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ example: Date.now() / 1000 })
  @TransformDateToEpoch()
  @Expose()
  updatedAt?: Date;
}
