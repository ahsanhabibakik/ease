import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import Account from '@/models/Account';
import VerificationToken from '@/models/VerificationToken';

// Lightweight custom adapter for Mongo using mongoose (session strategy = jwt)
const MongoAdapter = {
  async createUser(data: any) { await dbConnect(); const user = await User.create(data); return user.toObject(); },
  async getUser(id: string) { await dbConnect(); return User.findById(id).lean(); },
  async getUserByEmail(email: string) { await dbConnect(); return User.findOne({ email }).lean(); },
  async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string; }) {
    await dbConnect(); const account = await Account.findOne({ provider, providerAccountId }).lean(); if (!account) return null; return User.findById(account.userId).lean();
  },
  async updateUser(data: any) { await dbConnect(); const { id, ...rest } = data; return User.findByIdAndUpdate(id, rest, { new: true }).lean(); },
  async deleteUser(id: string) { await dbConnect(); await User.findByIdAndDelete(id); await Account.deleteMany({ userId: id }); return null; },
  async linkAccount(data: any) { await dbConnect(); await Account.create({ ...data, userId: data.userId }); return data; },
  async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string; }) { await dbConnect(); await Account.deleteOne({ provider, providerAccountId }); return null; },
  async createVerificationToken(data: any) { await dbConnect(); const vt = await VerificationToken.create(data); return { identifier: vt.identifier, token: vt.token, expires: vt.expires }; },
  async useVerificationToken({ identifier, token }: { identifier: string; token: string; }) { await dbConnect(); const vt = await VerificationToken.findOneAndDelete({ identifier, token }).lean(); if (!vt) return null; return { identifier: vt.identifier, token: vt.token, expires: vt.expires }; },
  // Sessions not used (JWT strategy)
  createSession: async () => null,
  getSessionAndUser: async () => null,
  updateSession: async () => null,
  deleteSession: async () => null,
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
  const user = await User.findOne({ email: credentials.email }).lean();
  if (!user || !user.hashedPassword) return null;
  const bcrypt = await import('bcryptjs');
  const valid = await bcrypt.compare(credentials.password, user.hashedPassword);
  if (!valid) return null;
  return { id: user.id, email: user.email, name: user.name };
    },
  }));
}

export const authOptions: NextAuthOptions = {
  adapter: MongoAdapter as any,
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
      // eslint-disable-next-line no-console
      console.error('[next-auth]', code, metadata);
    },
  },
};
