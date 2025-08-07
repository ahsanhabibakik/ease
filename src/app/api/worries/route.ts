import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createWorrySchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const worries = await prisma.worry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

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

    const worry = await prisma.worry.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        status: validatedData.scheduledAt ? 'SCHEDULED' : 'ACTIVE',
      },
    })

    return NextResponse.json(worry, { status: 201 })
  } catch (error) {
    console.error('Error creating worry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
