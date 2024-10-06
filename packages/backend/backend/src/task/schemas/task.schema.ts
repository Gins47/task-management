import { Schema } from 'mongoose';

export const TaskSchema = new Schema({
  id: { type: Number, required: true },
  content: { type: String, required: true },
  columnId: { type: Number, required: true },
  sequence: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});
