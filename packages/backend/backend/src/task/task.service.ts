// task/task.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(createTaskDto: CreateTaskDto) {
    return this.taskRepository.create(createTaskDto);
  }

  // Update a task
  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const { content } = updateTaskDto;
    const task = await this.taskRepository.updateTask(id, content);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateColumnId(taskId: string, columnId: number): Promise<Task> {
    const updatedTask = await this.taskRepository.updateColumnId(
      taskId,
      columnId,
    );
    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return updatedTask;
  }

  async getTasks() {
    return this.taskRepository.findAll();
  }
  // Update the sequence of a task
  async updateTaskSequence(taskId: string, sequence: number): Promise<Task> {
    return this.taskRepository.updateTaskSequence(taskId, sequence);
  }

  // Swap sequence of two tasks
  async swapTaskSequence(taskId1: string, taskId2: string): Promise<void> {
    console.log(
      ` swap task sequence == taskId1 = ${taskId1} taskId2 = ${taskId2}`,
    );
    return this.taskRepository.swapTaskSequence(taskId1, taskId2);
  }

  // Move task to a new column
  async moveTaskToColumn(taskId: string, newColumnId: string) {
    try {
      return this.taskRepository.moveTaskToColumn(taskId, newColumnId);
    } catch (error) {
      console.error(
        `Error occurred when moving task to another column ${error}`,
      );
      return;
    }
  }

  async deleteAllTasks() {
    return this.taskRepository.deleteAll();
  }

  async deleteTaskById(id: string) {
    return this.taskRepository.deleteById(id);
  }

  async deleteTasksByColumnId(
    columnId: number,
  ): Promise<{ deletedCount: number }> {
    const result = await this.taskRepository.deleteTasksByColumnId(columnId);
    return { deletedCount: result.deletedCount };
  }
}
