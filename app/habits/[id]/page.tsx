import { prisma } from '@/lib/prisma'
import { Navigation } from '@/components/layout/navigation'
import { Target, ArrowLeft, Calendar, Clock, TrendingUp, Flame } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HabitGrid } from '@/components/habits/habit-grid'
import { formatDate } from '@/lib/date'
import type { HabitHistory } from '@/types'

async function getHabit(id: string) {
  const habit = await prisma.habit.findUnique({
    where: { id },
    include: {
      history: {
        orderBy: {
          date: 'desc',
        },
      },
    },
  })

  if (!habit) {
    notFound()
  }

  return habit
}

function calculateStreak(history: any[]) {
  const sortedHistory = [...history]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  let streak = 0
  for (const entry of sortedHistory) {
    if (entry.status === 'completed') {
      streak++
    } else if (entry.status === 'missed') {
      break
    }
  }
  
  return streak
}

function calculateLongestStreak(history: any[]) {
  const sortedHistory = [...history]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  let longestStreak = 0
  let currentStreak = 0
  
  for (const entry of sortedHistory) {
    if (entry.status === 'completed') {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else if (entry.status === 'missed') {
      currentStreak = 0
    }
  }
  
  return longestStreak
}

function calculateConsistency(history: any[], startDate: Date) {
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  const completedDays = history.filter(h => h.status === 'completed').length
  
  if (daysSinceStart === 0) return 0
  
  return Math.round((completedDays / daysSinceStart) * 100)
}

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const habit = await getHabit(id)
  
  const currentStreak = calculateStreak(habit.history)
  const longestStreak = calculateLongestStreak(habit.history)
  const consistency = calculateConsistency(habit.history, habit.startDate)
  const totalCompleted = habit.history.filter(h => h.status === 'completed').length

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href="/habits"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Habits
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8" />
                <h1 className="text-4xl font-bold tracking-tight">{habit.name}</h1>
              </div>
              {habit.description && (
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-2">
                  {habit.description}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  habit.type === 'build'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                }`}>
                  {habit.type === 'build' ? 'Build Habit' : 'Quit Habit'}
                </span>
                <span className="px-3 py-1 rounded text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400">
                  {habit.frequency}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Current Streak
                  </p>
                  <p className="text-3xl font-bold">{currentStreak}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    days
                  </p>
                </div>
                <Flame className="w-8 h-8 text-orange-600 dark:text-orange-500" />
              </div>
            </div>

            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Longest Streak
                  </p>
                  <p className="text-3xl font-bold">{longestStreak}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    days
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-500" />
              </div>
            </div>

            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Consistency
                  </p>
                  <p className="text-3xl font-bold">{consistency}%</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    completion rate
                  </p>
                </div>
                <Target className="w-8 h-8 text-green-600 dark:text-green-500" />
              </div>
            </div>

            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Total Completed
                  </p>
                  <p className="text-3xl font-bold">{totalCompleted}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    days
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-500" />
              </div>
            </div>
          </div>

          {/* Habit Grid */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 mb-8">
            <h2 className="text-xl font-semibold mb-4">Activity</h2>
            <HabitGrid
              history={habit.history as HabitHistory[]}
              startDate={habit.startDate}
            />
          </div>

          {/* Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Started</span>
                  <span className="font-medium">{formatDate(habit.startDate)}</span>
                </div>
                {habit.endDate && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Ends</span>
                    <span className="font-medium">{formatDate(habit.endDate)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Reminder</span>
                  <span className="font-medium">{habit.reminderTime}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </h3>
              <div className="space-y-2 text-sm">
                {habit.history.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {formatDate(entry.date)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      entry.status === 'completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : entry.status === 'missed'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                ))}
                {habit.history.length === 0 && (
                  <p className="text-neutral-500 dark:text-neutral-500 text-center py-4">
                    No activity yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
