import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  hashedPassword?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  emailVerified: Date,
  image: String,
  hashedPassword: String,
}, { timestamps: true });

export default models.User || model<IUser>('User', UserSchema);
