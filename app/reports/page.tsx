'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/layout/navigation'
import { BarChart3, Calendar, Target, CheckSquare, Flame } from 'lucide-react'
import { getStartOfDay, getEndOfDay, getStartOfWeek, getEndOfWeek, getStartOfMonth, getEndOfMonth } from '@/lib/date'

export default function ReportsPage() {
  const [stats, setStats] = useState({
    today: { tasks: 0, habits: 0 },
    week: { tasks: 0, habits: 0, streak: 0 },
    month: { tasks: 0, habits: 0, longestStreak: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch tasks
      const tasksRes = await fetch('/api/tasks')
      const tasks = await tasksRes.json()

      // Fetch habits
      const habitsRes = await fetch('/api/habits')
      const habits = await habitsRes.json()

      const now = new Date()
      const todayStart = getStartOfDay(now)
      const todayEnd = getEndOfDay(now)
      const weekStart = getStartOfWeek(now)
      const weekEnd = getEndOfWeek(now)
      const monthStart = getStartOfMonth(now)
      const monthEnd = getEndOfMonth(now)

      // Calculate today's stats
      const todayTasks = tasks.filter((t: any) => {
        if (t.status !== 'completed' || !t.completedAt) return false
        const date = new Date(t.completedAt)
        return date >= todayStart && date <= todayEnd
      }).length

      const todayHabits = habits.reduce((count: number, h: any) => {
        const todayHistory = h.history.find((hist: any) => {
          const date = new Date(hist.date)
          return date >= todayStart && date <= todayEnd && hist.status === 'completed'
        })
        return todayHistory ? count + 1 : count
      }, 0)

      // Calculate week's stats
      const weekTasks = tasks.filter((t: any) => {
        if (t.status !== 'completed' || !t.completedAt) return false
        const date = new Date(t.completedAt)
        return date >= weekStart && date <= weekEnd
      }).length

      const weekHabits = habits.reduce((count: number, h: any) => {
        return count + h.history.filter((hist: any) => {
          const date = new Date(hist.date)
          return date >= weekStart && date <= weekEnd && hist.status === 'completed'
        }).length
      }, 0)

      // Calculate month's stats
      const monthTasks = tasks.filter((t: any) => {
        if (t.status !== 'completed' || !t.completedAt) return false
        const date = new Date(t.completedAt)
        return date >= monthStart && date <= monthEnd
      }).length

      const monthHabits = habits.reduce((count: number, h: any) => {
        return count + h.history.filter((hist: any) => {
          const date = new Date(hist.date)
          return date >= monthStart && date <= monthEnd && hist.status === 'completed'
        }).length
      }, 0)

      setStats({
        today: {
          tasks: todayTasks,
          habits: todayHabits,
        },
        week: {
          tasks: weekTasks,
          habits: weekHabits,
          streak: 0, // Will calculate properly later
        },
        month: {
          tasks: monthTasks,
          habits: monthHabits,
          longestStreak: 0, // Will calculate properly later
        },
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
              Loading reports...
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-8 h-8" />
            <h1 className="text-4xl font-bold tracking-tight">Reports</h1>
          </div>

          <div className="space-y-8">
            {/* Today */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Today</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        Tasks Completed
                      </p>
                      <p className="text-4xl font-bold">{stats.today.tasks}</p>
                    </div>
                    <CheckSquare className="w-10 h-10 text-green-600 dark:text-green-500" />
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        Habits Completed
                      </p>
                      <p className="text-4xl font-bold">{stats.today.habits}</p>
                    </div>
                    <Target className="w-10 h-10 text-blue-600 dark:text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* This Week */}
            <div>
              <h2 className="text-2xl font-bold mb-4">This Week</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        Tasks Completed
                      </p>
                      <p className="text-3xl font-bold">{stats.week.tasks}</p>
                    </div>
                    <CheckSquare className="w-8 h-8 text-green-600 dark:text-green-500" />
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        Habits Completed
                      </p>
                      <p className="text-3xl font-bold">{stats.week.habits}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        Current Streak
                      </p>
                      <p className="text-3xl font-bold">{stats.week.streak}</p>
                    </div>
                    <Flame className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* This Month */}
            <div>
              <h2 className="text-2xl font-bold mb-4">This Month</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        Total Tasks
                      </p>
                      <p className="text-3xl font-bold">{stats.month.tasks}</p>
                    </div>
                    <CheckSquare className="w-8 h-8 text-green-600 dark:text-green-500" />
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        Total Habits
                      </p>
                      <p className="text-3xl font-bold">{stats.month.habits}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        Longest Streak
                      </p>
                      <p className="text-3xl font-bold">{stats.month.longestStreak}</p>
                    </div>
                    <Flame className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900/50 dark:to-neutral-900/30">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Insights
              </h3>
              <div className="space-y-2 text-sm">
                {stats.today.tasks + stats.today.habits === 0 ? (
                  <p className="text-neutral-600 dark:text-neutral-400">
                    No activity today yet. Start by completing a task or habit!
                  </p>
                ) : (
                  <>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      You've completed <span className="font-semibold text-neutral-900 dark:text-neutral-100">{stats.today.tasks + stats.today.habits}</span> items today.
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      This week, you've completed <span className="font-semibold text-neutral-900 dark:text-neutral-100">{stats.week.tasks + stats.week.habits}</span> items total.
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Keep up the great work! 🎯
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
