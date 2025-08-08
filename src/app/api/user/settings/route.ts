import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { dbConnect } from '@/lib/mongoose';
import UserSettings from '@/models/UserSettings';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const settings = await UserSettings.findOne({ userId: session.user.id }).lean();
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { reflectionTime, customCategories, notifications } = body as { reflectionTime?: string; customCategories?: string[]; notifications?: boolean };
    await dbConnect();
    const settings = await UserSettings.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          ...(reflectionTime !== undefined && { reflectionTime }),
          ...(customCategories !== undefined && { customCategories }),
          ...(notifications !== undefined && { notifications }),
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
