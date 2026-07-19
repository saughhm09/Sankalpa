'use client'

import { useEffect, useState } from 'react'
import { dayjs, getGreeting } from '@/lib/date'

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')
  const [greeting, setGreeting] = useState<string>('')

  useEffect(() => {
    const updateDateTime = () => {
      setCurrentTime(dayjs().format('h:mm A'))
      setCurrentDate(dayjs().format('dddd, MMMM D, YYYY'))
      setGreeting(getGreeting())
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight">{greeting}</h1>
      <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
        <time className="text-lg">{currentDate}</time>
        <span className="text-lg">•</span>
        <time className="text-lg font-mono">{currentTime}</time>
      </div>
    </div>
  )
}
