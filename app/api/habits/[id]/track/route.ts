import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getStartOfDay, getEndOfDay } from '@/lib/date'

// POST track habit for a specific date
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const date = body.date ? new Date(body.date) : new Date()
    const startOfDay = getStartOfDay(date)
    const endOfDay = getEndOfDay(date)

    // Check if already tracked for this day
    const existing = await prisma.habitHistory.findFirst({
      where: {
        habitId: id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    if (existing) {
      // Update existing record
      const updated = await prisma.habitHistory.update({
        where: { id: existing.id },
        data: {
          status: body.status || 'completed',
          completedAt: body.status === 'completed' ? new Date() : null,
          duration: body.duration ? parseInt(body.duration) : null,
        },
      })
      return NextResponse.json(updated)
    } else {
      // Create new record
      const history = await prisma.habitHistory.create({
        data: {
          habitId: id,
          date: startOfDay,
          status: body.status || 'completed',
          completedAt: body.status === 'completed' ? new Date() : null,
          duration: body.duration ? parseInt(body.duration) : null,
        },
      })
      return NextResponse.json(history, { status: 201 })
    }
  } catch (error) {
    console.error('Track habit error:', error)
    return NextResponse.json(
      { error: 'Failed to track habit' },
      { status: 500 }
    )
  }
}
