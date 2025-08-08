import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const reflections = await prisma.reflection.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' }, take: 50 });
  return NextResponse.json({ reflections });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { worryId, evidenceFor, evidenceAgainst, alternativeView, worstCaseReality, gentleAction } = body as Record<string, string | undefined>;
    const reflection = await prisma.reflection.create({
      data: {
        userId: session.user.id,
        worryId: worryId || undefined,
        evidenceFor,
        evidenceAgainst,
        alternativeView,
        worstCaseReality,
        gentleAction,
        completed: true,
      },
    });
    return NextResponse.json({ reflection });
  } catch {
    return NextResponse.json({ error: 'Failed to create reflection' }, { status: 500 });
  }
}
