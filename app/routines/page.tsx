'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/layout/navigation'
import { List, Plus, Pencil, Trash2, Clock, MoveUp, MoveDown, X } from 'lucide-react'
import { Routine } from '@/types'

interface RoutineWithSteps extends Omit<Routine, 'steps'> {
  steps: {
    id: string
    name: string
    time: string | null
    duration: number | null
    order: number
  }[]
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<RoutineWithSteps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<RoutineWithSteps | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    steps: [{ name: '', time: '', duration: '' }],
  })

  useEffect(() => {
    fetchRoutines()
  }, [])

  const fetchRoutines = async () => {
    try {
      const response = await fetch('/api/routines')
      const data = await response.json()
      setRoutines(data)
    } catch (error) {
      console.error('Failed to fetch routines:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingRoutine) {
        const response = await fetch(`/api/routines/${editingRoutine.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        
        if (response.ok) {
          fetchRoutines()
          resetForm()
        }
      } else {
        const response = await fetch('/api/routines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        
        if (response.ok) {
          fetchRoutines()
          resetForm()
        }
      }
    } catch (error) {
      console.error('Failed to save routine:', error)
    }
  }

  const handleEdit = (routine: RoutineWithSteps) => {
    setEditingRoutine(routine)
    setFormData({
      name: routine.name,
      description: routine.description || '',
      steps: routine.steps.map(s => ({
        name: s.name,
        time: s.time || '',
        duration: s.duration?.toString() || '',
      })),
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this routine?')) return
    
    try {
      await fetch(`/api/routines/${id}`, { method: 'DELETE' })
      fetchRoutines()
    } catch (error) {
      console.error('Failed to delete routine:', error)
    }
  }

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { name: '', time: '', duration: '' }],
    })
  }

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
    })
  }

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...formData.steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setFormData({ ...formData, steps: newSteps })
  }

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...formData.steps]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newSteps.length) return
    
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]]
    setFormData({ ...formData, steps: newSteps })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      steps: [{ name: '', time: '', duration: '' }],
    })
    setEditingRoutine(null)
    setShowForm(false)
  }

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <List className="w-8 h-8" />
              <h1 className="text-4xl font-bold tracking-tight">Routines</h1>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Routine
            </button>
          </div>

          {/* Routine Form */}
          {showForm && (
            <div className="mb-8 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
              <h2 className="text-xl font-semibold mb-4">
                {editingRoutine ? 'Edit Routine' : 'New Routine'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Routine Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    placeholder="Morning Routine"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                    placeholder="Routine description (optional)"
                    rows={2}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium">Routine Steps</label>
                    <button
                      type="button"
                      onClick={addStep}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      + Add Step
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.steps.map((step, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => moveStep(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStep(index, 'down')}
                            disabled={index === formData.steps.length - 1}
                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            required
                            value={step.name}
                            onChange={(e) => updateStep(index, 'name', e.target.value)}
                            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                            placeholder="Step name"
                          />
                          <input
                            type="time"
                            value={step.time}
                            onChange={(e) => updateStep(index, 'time', e.target.value)}
                            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                            placeholder="Time"
                          />
                          <input
                            type="number"
                            value={step.duration}
                            onChange={(e) => updateStep(index, 'duration', e.target.value)}
                            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                            placeholder="Duration (min)"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          disabled={formData.steps.length === 1}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
                  >
                    {editingRoutine ? 'Update Routine' : 'Create Routine'}
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

          {/* Routines List */}
          {isLoading ? (
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
              Loading routines...
            </div>
          ) : routines.length === 0 ? (
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
              No routines yet. Create your first routine to get started!
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{routine.name}</h3>
                      {routine.description && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {routine.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(routine)}
                        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(routine.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {routine.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50"
                      >
                        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{step.name}</p>
                        </div>
                        {step.time && (
                          <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                            <Clock className="w-3 h-3" />
                            {step.time}
                          </div>
                        )}
                        {step.duration && (
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {step.duration}min
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {routine.steps.length} step{routine.steps.length !== 1 ? 's' : ''}
                      {routine.steps.reduce((acc, s) => acc + (s.duration || 0), 0) > 0 && (
                        <> • {routine.steps.reduce((acc, s) => acc + (s.duration || 0), 0)} min total</>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
