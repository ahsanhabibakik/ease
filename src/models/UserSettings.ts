import { Schema, model, models, Document, Types } from 'mongoose';

export interface IUserSettings extends Document {
  userId: Types.ObjectId;
  reflectionTime: string;
  customCategories: string[];
  notifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettings>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  reflectionTime: { type: String, default: '17:00' },
  customCategories: { type: [String], default: [] },
  notifications: { type: Boolean, default: true },
}, { timestamps: true });

export default models.UserSettings || model<IUserSettings>('UserSettings', UserSettingsSchema);
