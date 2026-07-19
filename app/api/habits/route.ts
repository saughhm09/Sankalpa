import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all habits
export async function GET() {
  try {
    const habits = await prisma.habit.findMany({
      include: {
        history: {
          orderBy: {
            date: 'desc',
          },
          take: 30,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(habits)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 }
    )
  }
}

// POST create new habit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const habit = await prisma.habit.create({
      data: {
        name: body.name,
        description: body.description || null,
        type: body.type,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        reminderTime: body.reminderTime,
        frequency: body.frequency || 'daily',
        targetDuration: body.targetDuration ? parseInt(body.targetDuration) : null,
      },
    })

    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    )
  }
}
