// Column/task.service.ts
import { Injectable } from '@nestjs/common';
import { ColumnRepository } from './column.repository';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnService {
  constructor(private readonly columnRepository: ColumnRepository) {}

  async createColumn(createColumnDto: CreateColumnDto) {
    return this.columnRepository.create(createColumnDto);
  }

  async updateColumnTitle(id: string, updateColumnDto: UpdateColumnDto) {
    return this.columnRepository.updateTitle(id, updateColumnDto.title);
  }

  async getColumns() {
    return this.columnRepository.findAll();
  }

  async deleteAllColumns() {
    return this.columnRepository.deleteAll();
  }

  async deleteColumnById(id: string) {
    return this.columnRepository.deleteById(id);
  }
}
