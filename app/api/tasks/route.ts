import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all tasks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    
    const tasks = await prisma.task.findMany({
      where: status ? { status } : undefined,
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || null,
        dueDate: new Date(body.dueDate),
        dueTime: body.dueTime || null,
        duration: body.duration ? parseInt(body.duration) : null,
        priority: body.priority || 'medium',
        status: 'pending',
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
