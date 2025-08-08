import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const settings = await prisma.userSettings.findUnique({ where: { userId: session.user.id } });
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { reflectionTime, customCategories, notifications } = body as { reflectionTime?: string; customCategories?: string[]; notifications?: boolean };
    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        reflectionTime: reflectionTime ?? undefined,
        customCategories: customCategories ?? undefined,
        notifications: notifications ?? undefined,
      },
      create: {
        userId: session.user.id,
        reflectionTime: reflectionTime || '17:00',
        customCategories: customCategories || [],
        notifications: notifications ?? true,
      },
    });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
