import { Column } from 'src/columns/entities/column.entity';

export class Task {
  id: string;
  columnId: string;
  sequence: number;
  content: string;
  updatedAt: Date;
}
