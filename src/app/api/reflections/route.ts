import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { dbConnect } from '@/lib/mongoose';
import Reflection from '@/models/Reflection';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const reflections = await Reflection.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(50).lean();
  return NextResponse.json({ reflections });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { worryId, evidenceFor, evidenceAgainst, alternativeView, worstCaseReality, gentleAction } = body as Record<string, string | undefined>;
    await dbConnect();
    const reflection = await Reflection.create({
      userId: session.user.id,
      worryId: worryId || undefined,
      evidenceFor,
      evidenceAgainst,
      alternativeView,
      worstCaseReality,
      gentleAction,
      completed: true,
    });
    return NextResponse.json({ reflection: reflection.toObject() });
  } catch {
    return NextResponse.json({ error: 'Failed to create reflection' }, { status: 500 });
  }
}
