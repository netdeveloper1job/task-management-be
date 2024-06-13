import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from './constants';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'User loged in successfullly.',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req,
  ): Promise<LoginResponseDto> {
    let user;
    if (req.user) {
      user = req.user;
    }
    return this.authService.login(user);
  }
}
