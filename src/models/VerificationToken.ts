import { Schema, model, models, Document } from 'mongoose';

export interface IVerificationToken extends Document {
  identifier: string;
  token: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
}, { timestamps: true });

// Composite uniqueness (identifier + token) mirrors previous relational schema
VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

export default models.VerificationToken || model<IVerificationToken>('VerificationToken', VerificationTokenSchema);
