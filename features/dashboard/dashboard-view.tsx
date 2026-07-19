import { Suspense } from 'react'
import { DashboardHeader } from './dashboard-header'
import { DashboardStats } from './dashboard-stats'
import { TodayTasks } from './today-tasks'
import { TodayHabits } from './today-habits'
import { TodayRoutines } from './today-routines'

export function DashboardView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <DashboardHeader />
      
      <Suspense fallback={<div className="h-32 animate-pulse bg-neutral-100 dark:bg-neutral-900 rounded-xl" />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-8 lg:grid-cols-2">
        <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-900 rounded-xl" />}>
          <TodayTasks />
        </Suspense>

        <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-900 rounded-xl" />}>
          <TodayHabits />
        </Suspense>
      </div>

      <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-900 rounded-xl" />}>
        <TodayRoutines />
      </Suspense>
    </div>
  )
}
