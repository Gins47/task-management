import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ColumnService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { ColumnSchema } from './schema/column.schema';
import { ColumnRepository } from './column.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Column', schema: ColumnSchema }]),
  ],
  controllers: [ColumnsController],
  providers: [ColumnService, ColumnRepository],
})
export class ColumnsModule {}
