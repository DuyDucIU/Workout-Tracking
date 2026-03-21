import type { PageResponse } from './common'

export type ExerciseCategory = 'CARDIO' | 'STRENGTH' | 'FLEXIBILITY'
export type MuscleGroup = 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE' | 'FULL_BODY'

export interface ExerciseDto {
  id: number
  name: string
  description: string | null
  category: ExerciseCategory
  muscleGroup: MuscleGroup
  isSystem: boolean
}

export interface ExerciseFilters {
  category?: ExerciseCategory
  muscleGroup?: MuscleGroup
  search?: string
  page?: number
  size?: number
}

export type ExercisePage = PageResponse<ExerciseDto>
