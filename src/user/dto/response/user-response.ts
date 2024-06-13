import { Expose } from '@nestjs/class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoggedInType } from 'src/common/Enums/registration.enum';
import { TransformDateToEpoch } from 'src/common/helper/decorators/transformDateToEpoch';
import { PrimaryGeneratedColumn } from 'typeorm';

export class UserResponse {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  password: string;

  @Expose()
  contactNo: string;

  @Expose()
  profileImage: string;

  @ApiProperty({ example: LoggedInType })
  @Expose()
  loggedInType: string;

  @ApiPropertyOptional({ example: Date.now() / 1000 })
  @TransformDateToEpoch()
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ example: Date.now() / 1000 })
  @TransformDateToEpoch()
  @Expose()
  updatedAt: Date;
}
