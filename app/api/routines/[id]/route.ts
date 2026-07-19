import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single routine
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    const routine = await prisma.routine.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!routine) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(routine)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch routine' },
      { status: 500 }
    )
  }
}

// PATCH update routine
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    
    // Delete existing steps
    await prisma.routineStep.deleteMany({
      where: { routineId: id },
    })

    // Update routine with new steps
    const routine = await prisma.routine.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
        steps: {
          create: body.steps?.map((step: any, index: number) => ({
            name: step.name,
            time: step.time || null,
            duration: step.duration ? parseInt(step.duration) : null,
            order: index,
          })) || [],
        },
      },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    return NextResponse.json(routine)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update routine' },
      { status: 500 }
    )
  }
}

// DELETE routine
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    await prisma.routine.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete routine' },
      { status: 500 }
    )
  }
}
