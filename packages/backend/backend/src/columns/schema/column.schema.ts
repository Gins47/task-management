import { Schema } from 'mongoose';

export const ColumnSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});
