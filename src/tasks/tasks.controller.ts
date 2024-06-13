import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/request/update-task.dto';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TaskParentRoute, TaskRoutes } from './task.http.routes';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { multerOptions } from 'src/common/helper/uploadImage/uploadImage';

@ApiTags('tasks')
@Controller({path: TaskParentRoute})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(TaskRoutes.create)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get(TaskRoutes.view_all)
  findAll(@Param('search') search: string) {
    return this.tasksService.findAll(search);
  }

  @Get(TaskRoutes.view_one)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(TaskRoutes.update)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(TaskRoutes.delete)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  @Get(TaskRoutes.getTasksByUserId)
  getTasksByUserId(@Param('id') id: number, @Param('search') search: string) {
    return this.tasksService.getTasksByUserId(+id,search);
  }
}
