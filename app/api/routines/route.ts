import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all routines
export async function GET() {
  try {
    const routines = await prisma.routine.findMany({
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(routines)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch routines' },
      { status: 500 }
    )
  }
}

// POST create new routine
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const routine = await prisma.routine.create({
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

    return NextResponse.json(routine, { status: 201 })
  } catch (error) {
    console.error('Create routine error:', error)
    return NextResponse.json(
      { error: 'Failed to create routine' },
      { status: 500 }
    )
  }
}
