import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/request/update-task.dto';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskParentRoute, TaskRoutes } from './task.http.routes';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskWithResponse } from './dto/response/taskWithResponse';

@ApiTags('tasks')
@Controller({path: TaskParentRoute})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: TaskWithResponse,
  })
  @Post(TaskRoutes.create)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: TaskWithResponse,
  })
  @Get(TaskRoutes.view_all)
  findAll(@Param('search') search: string) {
    return this.tasksService.findAll(search);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: TaskWithResponse,
  })
  @Get(TaskRoutes.view_one)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: TaskWithResponse,
  })
  @Patch(TaskRoutes.update)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: TaskWithResponse,
  })
  @Delete(TaskRoutes.delete)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: TaskWithResponse,
  })
  @Get(TaskRoutes.getTasksByUserId)
  getTasksByUserId(@Param('id') id: number) {
    return this.tasksService.getTasksByUserId(+id);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: TaskWithResponse,
  })
  @Get(TaskRoutes.filterTask)
  filterTask(@Param('filter') filter: string,@Param('id') id: number) {
    return this.tasksService.filterTask(filter,+id);
  }

  @ApiResponse({
    status: 201,
    description: 'Tasks.',
    type: TaskWithResponse,
  })
  @Get(TaskRoutes.filterAndSearchTasks)
  filterAndSearchTasks(@Param('filter') filter: string,@Param('id') id: number,@Param('searchQuery') searchQuery: string) {
    return this.tasksService.filterAndSearchTasks(filter,+id,searchQuery);
  }
}
