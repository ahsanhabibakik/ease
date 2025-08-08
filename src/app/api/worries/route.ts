import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { dbConnect } from '@/lib/mongoose';
import Worry from '@/models/Worry';
import { createWorrySchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

  await dbConnect();
  const worries = await Worry.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(worries)
  } catch (error) {
    console.error('Error fetching worries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createWorrySchema.parse(body)

    await dbConnect();
    const worry = await Worry.create({
      ...validatedData,
      userId: session.user.id,
      status: validatedData.scheduledAt ? 'SCHEDULED' : 'ACTIVE'
    });
    const json = worry.toObject();

    return NextResponse.json(json, { status: 201 })
  } catch (error) {
    console.error('Error creating worry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
