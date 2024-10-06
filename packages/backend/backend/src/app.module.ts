import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { ColumnsModule } from './columns/columns.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URL
        ? process.env.MONGO_URL
        : 'mongodb://localhost:27017/tasks',
    ),
    TaskModule,
    ColumnsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
