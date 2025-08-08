import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
  await dbConnect();
  const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name: name || undefined, hashedPassword });
  return NextResponse.json({ id: user._id.toString(), email: user.email }, { status: 201 });
  } catch (e) {
    console.error('Register error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
