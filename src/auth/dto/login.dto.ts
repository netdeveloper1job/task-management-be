import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class UserModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  userType: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: UserModel;
}
