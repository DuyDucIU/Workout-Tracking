export interface WorkoutLogDto {
  id: number
  planId: number | null
  sessionId: number | null
  planNameSnap: string
  sessionNameSnap: string
  completedDate: string
  notes: string | null
  createdAt: string
  entries: WorkoutLogEntryDto[]
}

export interface WorkoutLogSummaryDto {
  id: number
  planNameSnap: string
  sessionNameSnap: string
  completedDate: string
  entryCount: number
}

export interface WorkoutLogEntryDto {
  id: number
  exerciseId: number | null
  exerciseNameSnap: string
  actualSets: number
  actualReps: number
  actualWeightKg: number | null
  notes: string | null
}

export interface CreateWorkoutLogRequest {
  planId: number
  sessionId: number
  completedDate: string
  notes?: string
  entries: CreateLogEntryRequest[]
}

export interface CreateLogEntryRequest {
  exerciseId: number
  actualSets: number
  actualReps: number
  actualWeightKg?: number
  notes?: string
}
