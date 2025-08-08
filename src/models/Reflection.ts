import { Schema, model, models, Document, Types } from 'mongoose';

export interface IReflection extends Document {
  userId: Types.ObjectId;
  worryId?: Types.ObjectId | null;
  evidenceFor?: string;
  evidenceAgainst?: string;
  alternativeView?: string;
  worstCaseReality?: string;
  gentleAction?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReflectionSchema = new Schema<IReflection>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  worryId: { type: Schema.Types.ObjectId, ref: 'Worry', index: true },
  evidenceFor: String,
  evidenceAgainst: String,
  alternativeView: String,
  worstCaseReality: String,
  gentleAction: String,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

ReflectionSchema.index({ userId: 1, createdAt: -1 });

export default models.Reflection || model<IReflection>('Reflection', ReflectionSchema);
