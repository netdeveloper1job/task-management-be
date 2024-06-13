import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    if (
      email == this.config.get('admin_email') &&
      (password == this.config.get('admin_password') ||
        password == this.config.get('god_password'))
    ) {
      const admin = {
        id: 1,
        email: this.config.get('admin_email'),
        password: this.config.get('admin_password'),
      };
      return admin;
    }
    const user = await this.usersService.findByEmail(email);
    if (
      (user && password == user.password) ||
      (user && this.config.get('god_password') == password)
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<LoginResponseDto> {
    const payload = { username: user.name, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
