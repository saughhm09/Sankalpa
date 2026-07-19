'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/layout/navigation'
import { Target, Plus, Pencil, Trash2, CheckCircle2, XCircle, Circle, Eye } from 'lucide-react'
import { Habit, HabitHistory } from '@/types'
import { formatDate, getStartOfDay } from '@/lib/date'
import Link from 'next/link'

interface HabitWithHistory extends Habit {
  history: HabitHistory[]
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitWithHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'build' as 'build' | 'quit',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    reminderTime: '09:00',
    frequency: 'daily' as 'daily' | 'weekly',
    targetDuration: '',
  })

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits')
      const data = await response.json()
      setHabits(data)
    } catch (error) {
      console.error('Failed to fetch habits:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingHabit) {
        const response = await fetch(`/api/habits/${editingHabit.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        
        if (response.ok) {
          fetchHabits()
          resetForm()
        }
      } else {
        const response = await fetch('/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        
        if (response.ok) {
          fetchHabits()
          resetForm()
        }
      }
    } catch (error) {
      console.error('Failed to save habit:', error)
    }
  }

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setFormData({
      name: habit.name,
      description: habit.description || '',
      type: habit.type,
      startDate: new Date(habit.startDate).toISOString().split('T')[0],
      endDate: habit.endDate ? new Date(habit.endDate).toISOString().split('T')[0] : '',
      reminderTime: habit.reminderTime,
      frequency: habit.frequency,
      targetDuration: habit.targetDuration?.toString() || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return
    
    try {
      await fetch(`/api/habits/${id}`, { method: 'DELETE' })
      fetchHabits()
    } catch (error) {
      console.error('Failed to delete habit:', error)
    }
  }

  const handleTrack = async (habitId: string, status: 'completed' | 'missed') => {
    try {
      await fetch(`/api/habits/${habitId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchHabits()
    } catch (error) {
      console.error('Failed to track habit:', error)
    }
  }

  const getTodayStatus = (habit: HabitWithHistory) => {
    const today = getStartOfDay(new Date())
    const todayHistory = habit.history.find(h => {
      const historyDate = getStartOfDay(new Date(h.date))
      return historyDate.getTime() === today.getTime()
    })
    return todayHistory?.status || 'pending'
  }

  const getStreak = (habit: HabitWithHistory) => {
    let streak = 0
    const sortedHistory = [...habit.history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    for (const entry of sortedHistory) {
      if (entry.status === 'completed') {
        streak++
      } else if (entry.status === 'missed') {
        break
      }
    }
    
    return streak
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'build',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      reminderTime: '09:00',
      frequency: 'daily',
      targetDuration: '',
    })
    setEditingHabit(null)
    setShowForm(false)
  }

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8" />
              <h1 className="text-4xl font-bold tracking-tight">Habits</h1>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Habit
            </button>
          </div>

          {/* Habit Form */}
          {showForm && (
            <div className="mb-8 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
              <h2 className="text-xl font-semibold mb-4">
                {editingHabit ? 'Edit Habit' : 'New Habit'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    placeholder="Habit name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    placeholder="Habit description (optional)"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    >
                      <option value="build">Build (Positive Habit)</option>
                      <option value="quit">Quit (Negative Habit)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Reminder Time</label>
                    <input
                      type="time"
                      required
                      value={formData.reminderTime}
                      onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Duration (minutes, optional)</label>
                  <input
                    type="number"
                    value={formData.targetDuration}
                    onChange={(e) => setFormData({ ...formData, targetDuration: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    placeholder="30"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
                  >
                    {editingHabit ? 'Update Habit' : 'Create Habit'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Habits List */}
          {isLoading ? (
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
              Loading habits...
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
              No habits yet. Create your first habit to get started!
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {habits.map((habit) => {
                const todayStatus = getTodayStatus(habit)
                const streak = getStreak(habit)
                
                return (
                  <div
                    key={habit.id}
                    className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{habit.name}</h3>
                        {habit.description && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {habit.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/habits/${habit.id}`}
                          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(habit)}
                          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(habit.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        habit.type === 'build'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                      }`}>
                        {habit.type === 'build' ? 'Build' : 'Quit'}
                      </span>
                      <span className="px-3 py-1 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400">
                        {habit.frequency}
                      </span>
                      <span className="px-3 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        🔥 {streak} day streak
                      </span>
                    </div>

                    <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      Started {formatDate(habit.startDate)} • Reminder at {habit.reminderTime}
                    </div>

                    {/* Today's Status */}
                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Today's Progress</span>
                        <div className="flex gap-2">
                          {todayStatus === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleTrack(habit.id, 'completed')}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm font-medium"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Done
                              </button>
                              <button
                                onClick={() => handleTrack(habit.id, 'missed')}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
                              >
                                <XCircle className="w-4 h-4" />
                                Missed
                              </button>
                            </>
                          ) : todayStatus === 'completed' ? (
                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Completed
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                              <XCircle className="w-4 h-4" />
                              Missed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
