import { Schema, model, models, Document } from 'mongoose';

export interface IVerificationToken extends Document {
  identifier: string;
  token: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, required: true, index: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
}, { timestamps: true });

export default models.VerificationToken || model<IVerificationToken>('VerificationToken', VerificationTokenSchema);
