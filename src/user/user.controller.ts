import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserParentRoute, UserRoutes } from './user.http.routes';
import { Public } from 'src/auth/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/helper/uploadImage/uploadImage';
import { Observable, of } from 'rxjs';
import { UserWithResponse } from './dto/response/userWithResponse';

@ApiTags('users')
@Controller({ path: UserParentRoute })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: UserWithResponse,
  })
  @Public()
  @Post(UserRoutes.create)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: UserWithResponse,
  })
  @Get(UserRoutes.view_all)
  findAll() {
    return this.userService.findAll();
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: UserWithResponse,
  })
  @Get(UserRoutes.view_one)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: UserWithResponse,
  })
  @Patch(UserRoutes.update)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: UserWithResponse,
  })
  @Delete(UserRoutes.delete)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: UserWithResponse,
  })
  @Public()
  @Post(UserRoutes.upload_image)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file): Observable<Object> {
    return of({
      filePath: `${
        file.destination.search('task-management-be') !== -1
          ? file.destination.split('task-management-be').pop()
          : file.destination
      }/${file.filename}`,
      actualFileName: file.originalname,
    });
  }
}
