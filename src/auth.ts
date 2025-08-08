import { NextAuthOptions } from "next-auth";
import type { Adapter, AdapterUser as AdapterUserType } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import AccountModel from '@/models/Account';
import VerificationTokenModel from '@/models/VerificationToken';

// Lightweight custom adapter for Mongo using mongoose (session strategy = jwt)
// Local shapes for items not exported from next-auth/adapters in current version
interface AdapterAccountShape {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}
interface AdapterVerificationTokenShape { identifier: string; token: string; expires: Date; }

const MongoAdapter: Adapter = {
  async createUser(data: Omit<AdapterUserType, 'id'>) {
    await dbConnect();
    // Mongoose will ignore undefined fields; ensure email present per NextAuth contract
    const user = await User.create(data);
    const obj = user.toObject();
    return { id: user._id.toString(), name: obj.name ?? null, email: obj.email, emailVerified: obj.emailVerified ?? null, image: obj.image ?? null } satisfies AdapterUserType;
  },
  async getUser(id: string) {
    await dbConnect();
    const u = await User.findById(id).lean() as (AdapterUserType & { _id: { toString(): string } }) | null;
    if (!u) return null;
    return { id: u._id.toString(), name: u.name ?? null, email: u.email, emailVerified: u.emailVerified ?? null, image: u.image ?? null } satisfies AdapterUserType;
  },
  async getUserByEmail(email: string) {
    await dbConnect();
    const u = await User.findOne({ email }).lean() as (AdapterUserType & { _id: { toString(): string } }) | null;
    if (!u) return null;
    return { id: u._id.toString(), name: u.name ?? null, email: u.email, emailVerified: u.emailVerified ?? null, image: u.image ?? null } satisfies AdapterUserType;
  },
  async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
    await dbConnect();
    const account = await AccountModel.findOne({ provider, providerAccountId }).lean() as ({ userId: string } & { _id: unknown }) | null;
    if (!account) return null;
    const u = await User.findById(account.userId).lean() as (AdapterUserType & { _id: { toString(): string } }) | null;
    if (!u) return null;
    return { id: u._id.toString(), name: u.name ?? null, email: u.email, emailVerified: u.emailVerified ?? null, image: u.image ?? null } satisfies AdapterUserType;
  },
  async updateUser(data: Partial<AdapterUserType> & { id: string }) {
    await dbConnect();
    const { id, ...rest } = data;
    const u = await User.findByIdAndUpdate(id, rest, { new: true }).lean() as (AdapterUserType & { _id: { toString(): string } }) | null;
    if (!u) throw new Error('User not found');
    return { id: u._id.toString(), name: u.name ?? null, email: u.email, emailVerified: u.emailVerified ?? null, image: u.image ?? null } satisfies AdapterUserType;
  },
  async deleteUser(id: string) {
    await dbConnect();
    await User.findByIdAndDelete(id);
    await AccountModel.deleteMany({ userId: id });
    return null;
  },
  async linkAccount(data: AdapterAccountShape) {
    await dbConnect();
    await AccountModel.create({ ...data, userId: data.userId });
    return {
      userId: data.userId,
      type: data.type,
      provider: data.provider,
      providerAccountId: data.providerAccountId,
      refresh_token: data.refresh_token ?? null,
      access_token: data.access_token ?? null,
      expires_at: data.expires_at ?? null,
      token_type: data.token_type ?? null,
      scope: data.scope ?? null,
      id_token: data.id_token ?? null,
      session_state: data.session_state ?? null,
    } satisfies AdapterAccountShape;
  },
  async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
    await dbConnect();
    await AccountModel.deleteOne({ provider, providerAccountId });
    return undefined;
  },
  async createVerificationToken(data: AdapterVerificationTokenShape) {
    await dbConnect();
    const vt = await VerificationTokenModel.create(data);
    return { identifier: vt.identifier, token: vt.token, expires: vt.expires } satisfies AdapterVerificationTokenShape;
  },
  async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
    await dbConnect();
    const vt = await VerificationTokenModel.findOneAndDelete({ identifier, token }).lean() as (AdapterVerificationTokenShape & { _id: unknown }) | null;
    if (!vt) return null;
    return { identifier: vt.identifier, token: vt.token, expires: vt.expires } satisfies AdapterVerificationTokenShape;
  },
  // The following are not used since we use JWT strategy
  async createSession() { throw new Error('createSession not implemented: JWT strategy in use'); },
  async getSessionAndUser() { throw new Error('getSessionAndUser not implemented: JWT strategy in use'); },
  async updateSession() { throw new Error('updateSession not implemented: JWT strategy in use'); },
  async deleteSession() { throw new Error('deleteSession not implemented: JWT strategy in use'); },
};


// Build providers conditionally so missing env vars do not crash server
const providers: NextAuthOptions['providers'] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }));
}

// Optional Facebook provider
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  }));
}

if (
  process.env.EMAIL_SERVER_HOST &&
  process.env.EMAIL_SERVER_PORT &&
  process.env.EMAIL_SERVER_USER &&
  process.env.EMAIL_SERVER_PASSWORD &&
  process.env.EMAIL_FROM
) {
  providers.push(EmailProvider({
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  }));
}

// Credentials provider kept only if explicitly enabled (optional)
if (process.env.ENABLE_CREDENTIALS === 'true') {
  providers.push(CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      await dbConnect();
  const user = await User.findOne({ email: credentials.email }).lean() as (AdapterUserType & { _id: { toString(): string }; hashedPassword?: string }) | null;
  if (!user || !user.hashedPassword) return null;
  const bcrypt = await import('bcryptjs');
  const valid = await bcrypt.compare(credentials.password, user.hashedPassword);
  if (!valid) return null;
  return { id: user._id.toString(), email: user.email, name: user.name };
    },
  }));
}

export const authOptions: NextAuthOptions = {
  adapter: MongoAdapter,
  providers,
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin' },
  // Explicitly set secret to ensure stable JWT encryption/decryption
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string;
      return session;
    },
  },
  // So a single decryption failure doesn't spam console in layout
  logger: {
    error(code, metadata) {
      if (code === 'JWT_SESSION_ERROR') {
        // Likely stale/invalid cookie after secret change; silent fallback.
        return;
      }
  console.error('[next-auth]', code, metadata);
    },
  },
};
