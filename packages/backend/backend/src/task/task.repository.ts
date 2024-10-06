import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { id, columnId, content } = createTaskDto;
    const maxSequenceTask = await this.taskModel
      .findOne({ columnId })
      .sort({ sequence: -1 })
      .exec();
    const nextSequence = maxSequenceTask ? maxSequenceTask.sequence + 1 : 1;

    const newTask = new this.taskModel({
      id,
      content,
      columnId,
      sequence: nextSequence,
    });

    return newTask.save();
  }

  async findTasksByColumn(columnId: string): Promise<Task[]> {
    return this.taskModel.find({ columnId }).sort({ sequence: 1 }).exec();
  }

  // Update task content
  async updateTask(id: string, content: string) {
    return await this.taskModel.updateOne(
      { id },
      { content, updatedAt: new Date() },
      { new: true },
    );
  }

  async updateColumnId(taskId: string, columnId: number): Promise<Task> {
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { columnId, updatedAt: new Date() },
      { new: true },
    );
  }

  async updateTaskSequence(taskId: string, sequence: number): Promise<Task> {
    return this.taskModel.findByIdAndUpdate(
      taskId,
      { sequence, updatedAt: new Date() },
      { new: true },
    );
  }

  async swapTaskSequence(taskId1: string, taskId2: string): Promise<void> {
    console.log(` swapping task sequence repo`);
    // Find tasks using their custom `id` field instead of `_id`
    const task1 = await this.taskModel.findOne({ id: taskId1 });
    const task2 = await this.taskModel.findOne({ id: taskId2 });

    // Ensure both tasks exist
    if (!task1 || !task2) {
      throw new Error('Tasks not found');
    }

    // Store their current sequence numbers
    const task1Sequence = task1.sequence;
    const task2Sequence = task2.sequence;

    // Swap the sequences
    await this.taskModel.updateOne(
      { id: taskId1 },
      { sequence: task2Sequence },
    );
    await this.taskModel.updateOne(
      { id: taskId2 },
      { sequence: task1Sequence },
    );
  }

  // Move task to a new column and re-sequence tasks in both old and new columns
  async moveTaskToColumn(taskId: string, newColumnId: number) {
    const task = await this.taskModel.findOne({ id: taskId });
    if (!task) {
      throw new Error('Task not found');
    }

    const oldColumnId = task.columnId;

    // Find the max sequence in the new column
    const maxSequenceTask = await this.taskModel
      .findOne({ columnId: newColumnId })
      .sort({ sequence: -1 })
      .exec();
    const nextSequence = maxSequenceTask ? maxSequenceTask.sequence + 1 : 1;

    // Update the task's columnId and sequence
    await this.taskModel.updateOne(
      { id: taskId },
      { columnId: newColumnId, sequence: nextSequence, updatedAt: new Date() },
      { new: true },
    );

    // re-sequence the old column tasks (e.g., decrease sequences after the task is moved)
    await this.resequenceColumnTasks(oldColumnId);

    //send updated list
    const updatedTaskList = await this.findAll();

    return updatedTaskList;
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().sort({ sequence: 1 }).exec();
  }

  // Function to delete a task by its ID
  async deleteById(id: string) {
    return this.taskModel.deleteOne({ id }).exec();
  }

  // Function to delete tasks by columnId

  async deleteTasksByColumnId(
    columnId: number,
  ): Promise<{ deletedCount: number }> {
    console.log(` Deleting all task in the column ${columnId}`);
    const result = await this.taskModel.deleteMany({ columnId });
    return { deletedCount: result.deletedCount }; // Returns the number of deleted tasks
  }

  // Function to delete all tasks
  async deleteAll(): Promise<{ deletedCount: number }> {
    return this.taskModel.deleteMany({}).exec();
  }

  // Helper function to re-sequence tasks in a column
  private async resequenceColumnTasks(columnId: string): Promise<void> {
    const tasks = await this.findTasksByColumn(columnId);
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].sequence !== i + 1) {
        await this.taskModel.findByIdAndUpdate(tasks[i].id, {
          sequence: i + 1,
        });
      }
    }
  }
}
