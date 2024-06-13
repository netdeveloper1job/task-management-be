import { Expose } from '@nestjs/class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user-response';

export class UserWithResponse {
  @ApiProperty({
    title: 'Message',
    description: 'User Created Success fully',
    example: 'Process Successful',
  })
  @Expose()
  message: string;

  @ApiProperty({
    title: 'Data',
    description: 'Specifies response data',
  })
  @Expose()
  data?: UserResponse | UserResponse[];

  constructor(message: string, data: UserResponse | UserResponse[]) {
    this.data = data;
    this.message = message;
  }
}
