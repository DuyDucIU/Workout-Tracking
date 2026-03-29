export interface ProgressDataPointDto {
  date: string
  maxWeightKg: number
  totalVolumeKg: number
  totalReps: number
}

export interface SummaryStatsDto {
  totalWorkouts: number
  totalVolumeKg: number
  currentStreak: number
  longestStreak: number
}

export interface PersonalRecordDto {
  exerciseId: number
  exerciseName: string
  maxWeightKg: number
  achievedDate: string
}
