import { Schema, model, models, Document, Types } from 'mongoose';

export interface IWorry extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  category?: string;
  bodyFeeling?: string;
  intensity?: number;
  status: 'ACTIVE' | 'SCHEDULED' | 'RESOLVED' | 'ARCHIVED';
  scheduledAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const WorrySchema = new Schema<IWorry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, required: true },
  description: String,
  category: String,
  bodyFeeling: String,
  intensity: Number,
  status: { type: String, enum: ['ACTIVE','SCHEDULED','RESOLVED','ARCHIVED'], default: 'ACTIVE', index: true },
  scheduledAt: Date,
}, { timestamps: true });

export default models.Worry || model<IWorry>('Worry', WorrySchema);
