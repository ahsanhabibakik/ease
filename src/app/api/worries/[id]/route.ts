import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { dbConnect } from '@/lib/mongoose';
import Worry from '@/models/Worry';

// Utility to extract the dynamic id from the pathname (works around type param issues)
function extractIdFromPath(pathname: string): string | null {
  // Expect .../api/worries/{id}
  const parts = pathname.split('/');
  const idx = parts.findIndex(p => p === 'worries');
  if (idx !== -1 && parts.length > idx + 1) return parts[idx + 1] || null;
  return null;
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const worryId = extractIdFromPath(request.nextUrl.pathname);
  if (!worryId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const body = await request.json();
    const { status } = body as { status?: string };
    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }
  const allowed = ['RESOLVED','ARCHIVED'];
  if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
  await dbConnect();
  const updated = await Worry.findOneAndUpdate({ _id: worryId, userId: session.user.id }, { status }, { new: true }).lean();
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating worry:', error);
    return NextResponse.json({ error: 'Failed to update worry' }, { status: 500 });
  }
}
