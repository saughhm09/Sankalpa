export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'in-progress' | 'completed'

export type HabitType = 'build' | 'quit'
export type HabitFrequency = 'daily' | 'weekly'
export type HabitStatus = 'completed' | 'missed' | 'pending'

export type RoutineStatus = 'in-progress' | 'completed' | 'cancelled'

export type TimerType = 'task' | 'routine-step' | 'general'
export type TimerStatus = 'running' | 'paused' | 'stopped'

export interface Task {
  id: string
  title: string
  description?: string | null
  dueDate: Date
  dueTime?: string | null
  duration?: number | null
  priority: TaskPriority
  status: TaskStatus
  completedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Habit {
  id: string
  name: string
  description?: string | null
  type: HabitType
  startDate: Date
  endDate?: Date | null
  reminderTime: string
  frequency: HabitFrequency
  targetDuration?: number | null
  createdAt: Date
  updatedAt: Date
}

export interface HabitHistory {
  id: string
  habitId: string
  date: Date
  status: HabitStatus
  completedAt?: Date | null
  duration?: number | null
  createdAt: Date
}

export interface Routine {
  id: string
  name: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
  steps?: RoutineStep[]
}

export interface RoutineStep {
  id: string
  routineId: string
  name: string
  time?: string | null
  duration?: number | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface RoutineExecution {
  id: string
  routineId: string
  startedAt: Date
  completedAt?: Date | null
  currentStepId?: string | null
  totalSteps: number
  completedSteps: number
  status: RoutineStatus
}

export interface Timer {
  id: string
  type: TimerType
  referenceId?: string | null
  duration: number
  elapsed: number
  status: TimerStatus
  startedAt?: Date | null
  pausedAt?: Date | null
  completedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}
