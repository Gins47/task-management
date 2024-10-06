import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ColumnService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnService) {}

  @Post()
  create(@Body() createColumnDto: CreateColumnDto) {
    console.log(`create body params == ${JSON.stringify(createColumnDto)}`);
    return this.columnsService.createColumn(createColumnDto);
  }

  @Get()
  findAll() {
    return this.columnsService.getColumns();
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
  //   return this.columnsService.update(+id, updateColumnDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnsService.deleteColumnById(id);
  }

  @Delete()
  deleteAll() {
    return this.columnsService.deleteAllColumns();
  }
}
