import Link from 'next/link'
import { CheckSquare } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="text-center px-4">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center shadow-2xl">
              <CheckSquare className="w-12 h-12 text-white dark:text-neutral-900" strokeWidth={2.5} />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-neutral-400 to-neutral-600 dark:from-neutral-600 dark:to-neutral-400 opacity-20 blur-xl -z-10"></div>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-br from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
          Sankalpa
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-md mx-auto">
          Your discipline system for productivity and personal growth
        </p>

        {/* Get Started Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-all hover:scale-105 shadow-lg"
        >
          Get Started
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-sm">
          <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-900/50 backdrop-blur border border-neutral-200 dark:border-neutral-800">
            <div className="font-semibold mb-1">Track Tasks</div>
            <div className="text-neutral-600 dark:text-neutral-400">Organize and complete your daily goals</div>
          </div>
          <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-900/50 backdrop-blur border border-neutral-200 dark:border-neutral-800">
            <div className="font-semibold mb-1">Build Habits</div>
            <div className="text-neutral-600 dark:text-neutral-400">Create positive routines and streaks</div>
          </div>
          <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-900/50 backdrop-blur border border-neutral-200 dark:border-neutral-800">
            <div className="font-semibold mb-1">Stay Focused</div>
            <div className="text-neutral-600 dark:text-neutral-400">Use timers and routines for discipline</div>
          </div>
        </div>
      </div>
    </main>
  )
}
