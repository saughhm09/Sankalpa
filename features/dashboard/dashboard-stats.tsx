import { prisma } from '@/lib/prisma'
import { getStartOfDay, getEndOfDay } from '@/lib/date'
import { CheckCircle2, Target, Flame } from 'lucide-react'

async function getStats() {
  const today = new Date()
  const startOfDay = getStartOfDay(today)
  const endOfDay = getEndOfDay(today)

  const [completedTasks, todayHabits, currentStreak] = await Promise.all([
    prisma.task.count({
      where: {
        status: 'completed',
        completedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
    prisma.habit.count(),
    // For now, we'll calculate streak in the future
    Promise.resolve(0),
  ])

  return {
    completedTasks,
    todayHabits,
    currentStreak,
  }
}

export async function DashboardStats() {
  const stats = await getStats()

  const items = [
    {
      label: 'Tasks Completed',
      value: stats.completedTasks,
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-500',
    },
    {
      label: 'Active Habits',
      value: stats.todayHabits,
      icon: Target,
      color: 'text-blue-600 dark:text-blue-500',
    },
    {
      label: 'Current Streak',
      value: stats.currentStreak,
      icon: Flame,
      color: 'text-orange-600 dark:text-orange-500',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.label}</p>
                <p className="text-3xl font-bold">{item.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${item.color}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
