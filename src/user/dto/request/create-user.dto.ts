import { IsEmail, IsEnum, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoggedInType } from '../../../common/Enums/registration.enum';

export class CreateUserDto {

  @IsNotEmpty({ message: 'Name should not be empty' })
  @ApiProperty()
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @ApiProperty()
  password: string;

  @IsNotEmpty({ message: 'Contact Number should not be empty' })
  @ApiProperty()
  contactNo: string;

  @ApiProperty()
  profileImage: string;

  @ApiProperty({ default: LoggedInType.USER })
  @IsEnum(LoggedInType)
  loggedInType: LoggedInType;
}
