import { prisma } from '@/lib/prisma'
import { getStartOfDay, getEndOfDay } from '@/lib/date'
import { CheckSquare, Plus } from 'lucide-react'
import Link from 'next/link'

async function getTodayTasks() {
  const today = new Date()
  const startOfDay = getStartOfDay(today)
  const endOfDay = getEndOfDay(today)

  const tasks = await prisma.task.findMany({
    where: {
      dueDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: [
      { status: 'asc' },
      { priority: 'desc' },
    ],
    take: 5,
  })

  return tasks
}

export async function TodayTasks() {
  const tasks = await getTodayTasks()

  return (
    <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Today&apos;s Tasks</h2>
        </div>
        <Link
          href="/tasks"
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          View all
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-neutral-600 dark:text-neutral-400">No tasks for today</p>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    task.status === 'completed'
                      ? 'bg-green-500'
                      : task.status === 'in-progress'
                      ? 'bg-blue-500'
                      : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    task.status === 'completed' ? 'line-through text-neutral-500' : ''
                  }`}>
                    {task.title}
                  </p>
                </div>
                {task.priority && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    task.priority === 'high'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400'
                  }`}>
                    {task.priority}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
