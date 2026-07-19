'use client'

import { useState, useEffect, useRef } from 'react'
import { Navigation } from '@/components/layout/navigation'
import { Clock, Play, Pause, RotateCcw, Square } from 'lucide-react'

export default function TimerPage() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // total seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleStop()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused])

  const getTotalSeconds = () => {
    return minutes * 60 + seconds
  }

  const handleStart = () => {
    if (!isRunning) {
      setTimeLeft(getTotalSeconds())
    }
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(getTotalSeconds())
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleReset = () => {
    handleStop()
  }

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const totalDuration = getTotalSeconds()
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0

  const presets = [
    { label: '1m', minutes: 1, seconds: 0 },
    { label: '5m', minutes: 5, seconds: 0 },
    { label: '15m', minutes: 15, seconds: 0 },
    { label: '25m', minutes: 25, seconds: 0 },
    { label: '45m', minutes: 45, seconds: 0 },
    { label: '60m', minutes: 60, seconds: 0 },
  ]

  const handlePreset = (mins: number, secs: number) => {
    setMinutes(mins)
    setSeconds(secs)
    setTimeLeft(mins * 60 + secs)
  }

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-8 h-8" />
            <h1 className="text-4xl font-bold tracking-tight">Timer</h1>
          </div>

          <div className="p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-neutral-200 dark:text-neutral-800"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="text-neutral-900 dark:text-neutral-100 transition-all duration-1000"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold font-mono">{formatTime(timeLeft)}</div>
                </div>
              </div>

              {/* Duration Input */}
              {!isRunning && (
                <div className="mb-6 space-y-4">
                  {/* Presets */}
                  <div className="flex justify-center gap-2 flex-wrap">
                    {presets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => handlePreset(preset.minutes, preset.seconds)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          minutes === preset.minutes && seconds === preset.seconds
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Duration */}
                  <div className="flex items-center justify-center gap-3">
                    <label className="text-sm text-neutral-600 dark:text-neutral-400">
                      Custom:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          value={minutes}
                          onChange={(e) => {
                            const val = Math.max(0, Math.min(180, parseInt(e.target.value) || 0))
                            setMinutes(val)
                            setTimeLeft(val * 60 + seconds)
                          }}
                          className="w-20 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                          min="0"
                          max="180"
                        />
                        <span className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">minutes</span>
                      </div>
                      
                      <span className="text-2xl font-bold text-neutral-400">:</span>
                      
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          value={seconds}
                          onChange={(e) => {
                            const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                            setSeconds(val)
                            setTimeLeft(minutes * 60 + val)
                          }}
                          className="w-20 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                          min="0"
                          max="59"
                        />
                        <span className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    disabled={getTotalSeconds() === 0}
                    className="flex items-center gap-2 px-8 py-3 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-5 h-5" />
                    Start
                  </button>
                ) : (
                  <>
                    {isPaused ? (
                      <button
                        onClick={handleResume}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        Resume
                      </button>
                    ) : (
                      <button
                        onClick={handlePause}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition-colors"
                      >
                        <Pause className="w-5 h-5" />
                        Pause
                      </button>
                    )}
                    
                    <button
                      onClick={handleStop}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                    >
                      <Square className="w-5 h-5" />
                      Stop
                    </button>
                  </>
                )}
                
                {(isRunning || timeLeft !== getTotalSeconds()) && (
                  <button
                    onClick={handleReset}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold mb-3">Tips for focused work:</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>• Remove all distractions before starting</li>
                <li>• Use 25-minute Pomodoro sessions for maximum productivity</li>
                <li>• Take 5-minute breaks between sessions</li>
                <li>• Stay hydrated and maintain good posture</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
