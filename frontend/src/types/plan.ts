import type { ExerciseDto } from './exercise'

export type WorkoutDayOfWeek =
  | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY'
  | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

export interface WorkoutPlanDto {
  id: number
  name: string
  description: string | null
  isActive: boolean
  sessionCount: number
  createdAt: string
  sessions: SessionDto[]
}

export interface WorkoutPlanSummaryDto {
  id: number
  name: string
  isActive: boolean
}

export interface SessionExerciseDto {
  id: number
  sessionId: number
  exercise: ExerciseDto
  sets: number
  reps: number
  weightKg: number | null
  notes: string | null
  orderIndex: number
}

export interface SessionDto {
  id: number
  planId: number
  name: string
  dayOfWeek: WorkoutDayOfWeek | null
  orderIndex: number
  exercises: SessionExerciseDto[]
}

export interface CreatePlanRequest {
  name: string
  description?: string
  isActive?: boolean
}

export interface UpdatePlanRequest {
  name?: string
  description?: string
  isActive?: boolean
}

export interface CreateSessionRequest {
  name: string
  dayOfWeek?: WorkoutDayOfWeek
  orderIndex?: number
}

export interface UpdateSessionRequest {
  name?: string
  dayOfWeek?: WorkoutDayOfWeek
  orderIndex?: number
}

export interface CreateSessionExerciseRequest {
  exerciseId: number
  sets: number
  reps: number
  weightKg?: number
  notes?: string
  orderIndex?: number
}

export interface UpdateSessionExerciseRequest {
  sets?: number
  reps?: number
  weightKg?: number
  notes?: string
  orderIndex?: number
}
