import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Column } from './entities/column.entity';
import { CreateColumnDto } from './dto/create-column.dto';

@Injectable()
export class ColumnRepository {
  constructor(
    @InjectModel('Column') private readonly columnModel: Model<Column>,
  ) {}

  async create(column: CreateColumnDto): Promise<Column> {
    const newTask = new this.columnModel({ ...column });
    return newTask.save();
  }

  async updateTitle(id: string, title: string) {
    return await this.columnModel.updateOne(
      { id },
      { title, updatedAt: new Date() },
      { new: true },
    );
  }

  async findById(id: string) {
    return this.columnModel.findOne({}, { id }).exec();
  }

  async findAll(): Promise<Column[]> {
    return this.columnModel.find({}, { id: 1, title: 1, updatedAt: 1 }).exec();
  }

  // Function to delete a task by its ID
  async deleteById(id: string) {
    return this.columnModel.deleteOne({ id });
  }

  // Function to delete all tasks
  async deleteAll(): Promise<{ deletedCount: number }> {
    return this.columnModel.deleteMany({}).exec();
  }
}
