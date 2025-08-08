import { Schema, model, models, Document, Types } from 'mongoose';

export interface IAccount extends Document {
  userId: Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true },
  provider: { type: String, required: true, index: true },
  providerAccountId: { type: String, required: true, index: true },
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String,
}, { timestamps: true });

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export default models.Account || model<IAccount>('Account', AccountSchema);
