import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    console.log(`create task body == ${JSON.stringify(createTaskDto)}`);
    return this.taskService.createTask(createTaskDto);
  }

  // Update task content
  @Put(':id/content')
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    console.log(`inside update task content `, taskId, updateTaskDto);
    return this.taskService.updateTask(taskId, updateTaskDto);
  }

  // Swap sequence of two tasks
  @Put('swap')
  async swapTaskSequence(
    @Body('taskId1') taskId1: string,
    @Body('taskId2') taskId2: string,
  ): Promise<void> {
    return this.taskService.swapTaskSequence(taskId1, taskId2);
  }

  // Move task to a new column
  @Put(':id/move-column')
  async moveTaskToColumn(
    @Param('id') taskId: string,
    @Body('newColumnId') newColumnId: number,
  ) {
    console.log(`Inside moving task to column `, taskId, newColumnId);
    return this.taskService.moveTaskToColumn(taskId, newColumnId);
  }

  // @Put(':id/column')
  // async updateColumnId(
  //   @Param('id') taskId: string,
  //   @Body('columnId') columnId: number,
  // ): Promise<Task> {
  //   return this.taskService.updateColumnId(taskId, columnId);
  // }

  @Get()
  getTasks() {
    return this.taskService.getTasks();
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    console.log(`Deleting task with id: ${id}`);
    const task = this.taskService.deleteTaskById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return { message: 'Task deleted successfully' };
  }

  @Delete()
  async deleteAll(): Promise<{ deletedCount: number }> {
    return this.taskService.deleteAllTasks();
  }

  @Delete('column/:columnId')
  async deleteTasksByColumnId(
    @Param('columnId') columnId: number,
  ): Promise<{ deletedCount: number }> {
    return this.taskService.deleteTasksByColumnId(columnId);
  }

  @Put(':id/sequence')
  async updateTaskSequence(
    @Param('id') taskId: string,
    @Body('sequence') sequence: number,
  ): Promise<Task> {
    return this.taskService.updateTaskSequence(taskId, sequence);
  }
}
