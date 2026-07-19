import { prisma } from '@/lib/prisma'
import { getStartOfDay, getEndOfDay } from '@/lib/date'
import { Target, Plus } from 'lucide-react'
import Link from 'next/link'

async function getTodayHabits() {
  const today = new Date()
  const startOfDay = getStartOfDay(today)
  const endOfDay = getEndOfDay(today)

  const habits = await prisma.habit.findMany({
    include: {
      history: {
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })

  return habits.map(habit => ({
    ...habit,
    todayStatus: habit.history[0]?.status || 'pending',
  }))
}

export async function TodayHabits() {
  const habits = await getTodayHabits()

  return (
    <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Today&apos;s Habits</h2>
        </div>
        <Link
          href="/habits"
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          View all
        </Link>
      </div>

      {habits.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-neutral-600 dark:text-neutral-400">No habits created yet</p>
          <Link
            href="/habits"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Habit
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    habit.todayStatus === 'completed'
                      ? 'bg-green-500'
                      : habit.todayStatus === 'missed'
                      ? 'bg-red-500'
                      : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{habit.name}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  habit.type === 'build'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                }`}>
                  {habit.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
