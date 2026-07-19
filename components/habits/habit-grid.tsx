'use client'

import { HabitHistory } from '@/types'
import { dayjs, getStartOfDay } from '@/lib/date'
import { useMemo } from 'react'

interface HabitGridProps {
  history: HabitHistory[]
  startDate: Date
}

export function HabitGrid({ history, startDate }: HabitGridProps) {
  const gridData = useMemo(() => {
    // Calculate grid for last 12 weeks (84 days)
    const today = dayjs()
    const startOfWeek = today.startOf('week')
    const weeks = 12
    const days = weeks * 7

    // Create array of last 84 days
    const daysArray = Array.from({ length: days }, (_, i) => {
      return startOfWeek.subtract(days - 1 - i, 'day')
    })

    // Map history to dates
    const historyMap = new Map<string, HabitHistory>()
    history.forEach((h) => {
      const dateKey = dayjs(h.date).format('YYYY-MM-DD')
      historyMap.set(dateKey, h)
    })

    // Create grid data
    const grid: Array<{
      date: dayjs.Dayjs
      status: 'completed' | 'missed' | 'pending' | 'future' | 'before-start'
      history?: HabitHistory
    }> = []

    const habitStartDate = dayjs(startDate).startOf('day')

    daysArray.forEach((date) => {
      const dateKey = date.format('YYYY-MM-DD')
      const historyEntry = historyMap.get(dateKey)
      
      let status: 'completed' | 'missed' | 'pending' | 'future' | 'before-start'
      
      if (date.isBefore(habitStartDate)) {
        status = 'before-start'
      } else if (date.isAfter(today, 'day')) {
        status = 'future'
      } else if (historyEntry) {
        status = historyEntry.status as 'completed' | 'missed' | 'pending'
      } else if (date.isSame(today, 'day')) {
        status = 'pending'
      } else {
        status = 'missed'
      }

      grid.push({
        date,
        status,
        history: historyEntry,
      })
    })

    return grid
  }, [history, startDate])

  // Group by weeks
  const weeks = useMemo(() => {
    const weeksArray: typeof gridData[] = []
    for (let i = 0; i < gridData.length; i += 7) {
      weeksArray.push(gridData.slice(i, i + 7))
    }
    return weeksArray
  }, [gridData])

  const getColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 dark:bg-green-600'
      case 'missed':
        return 'bg-red-500 dark:bg-red-600'
      case 'pending':
        return 'bg-yellow-500 dark:bg-yellow-600'
      case 'future':
        return 'bg-neutral-100 dark:bg-neutral-800'
      case 'before-start':
        return 'bg-neutral-50 dark:bg-neutral-900'
      default:
        return 'bg-neutral-200 dark:bg-neutral-700'
    }
  }

  const getTooltip = (date: dayjs.Dayjs, status: string) => {
    const dateStr = date.format('MMM D, YYYY')
    switch (status) {
      case 'completed':
        return `${dateStr} - Completed ✓`
      case 'missed':
        return `${dateStr} - Missed ✗`
      case 'pending':
        return `${dateStr} - Pending`
      case 'future':
        return `${dateStr} - Future`
      case 'before-start':
        return `${dateStr} - Before habit start`
      default:
        return dateStr
    }
  }

  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; index: number }> = []
    let currentMonth = ''

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0]
      const month = firstDay.date.format('MMM')
      
      if (month !== currentMonth) {
        labels.push({ month, index: weekIndex })
        currentMonth = month
      }
    })

    return labels
  }, [weeks])

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-start">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] pt-6 pr-2">
          {dayLabels.map((day, i) => (
            <div
              key={day}
              className="text-[10px] text-neutral-500 dark:text-neutral-500 h-[12px] flex items-center"
              style={{ 
                opacity: i % 2 === 1 ? 1 : 0,
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid container */}
        <div className="flex-1">
          {/* Month labels */}
          <div className="relative h-5 mb-1">
            {monthLabels.map((label) => (
              <div
                key={`${label.month}-${label.index}`}
                className="absolute text-xs text-neutral-600 dark:text-neutral-400"
                style={{ left: `${label.index * 15}px` }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-[12px] h-[12px] rounded-sm ${getColor(day.status)} transition-colors hover:ring-2 hover:ring-neutral-400 dark:hover:ring-neutral-500`}
                    title={getTooltip(day.date, day.status)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-neutral-600 dark:text-neutral-400">
            <span>Less</span>
            <div className="flex gap-[3px]">
              <div className="w-[12px] h-[12px] rounded-sm bg-neutral-100 dark:bg-neutral-800" title="Future" />
              <div className="w-[12px] h-[12px] rounded-sm bg-yellow-500 dark:bg-yellow-600" title="Pending" />
              <div className="w-[12px] h-[12px] rounded-sm bg-red-500 dark:bg-red-600" title="Missed" />
              <div className="w-[12px] h-[12px] rounded-sm bg-green-500 dark:bg-green-600" title="Completed" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}
