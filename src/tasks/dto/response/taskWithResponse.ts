import { Expose } from '@nestjs/class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskResponse } from './task-response';

export class TaskWithResponse {
  @ApiProperty({
    title: 'Message',
    description: 'Task Created Success fully',
    example: 'Process Successful',
  })
  @Expose()
  message: string;

  @ApiProperty({
    title: 'Data',
    description: 'Specifies response data',
  })
  @Expose()
  data?: TaskResponse | TaskResponse[];

  constructor(message: string, data: TaskResponse | TaskResponse[]) {
    this.data = data;
    this.message = message;
  }
}
