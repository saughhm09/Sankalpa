import { prisma } from '@/lib/prisma'
import { List, Plus } from 'lucide-react'
import Link from 'next/link'

async function getRoutines() {
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
    take: 3,
  })

  return routines
}

export async function TodayRoutines() {
  const routines = await getRoutines()

  return (
    <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Routines</h2>
        </div>
        <Link
          href="/routines"
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          View all
        </Link>
      </div>

      {routines.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-neutral-600 dark:text-neutral-400">No routines created yet</p>
          <Link
            href="/routines"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Routine
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {routines.map((routine) => (
            <Link
              key={routine.id}
              href={`/routines/${routine.id}`}
              className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <h3 className="font-medium mb-2">{routine.name}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {routine.steps.length} {routine.steps.length === 1 ? 'step' : 'steps'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
