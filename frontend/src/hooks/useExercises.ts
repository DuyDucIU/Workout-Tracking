import { useQuery } from '@tanstack/react-query'
import { keepPreviousData } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ExerciseDto, ExerciseFilters, ExercisePage } from '@/types/exercise'

export function useExercises(filters: ExerciseFilters = {}) {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: () =>
      api.get<ExercisePage>('/exercises', { params: filters }).then(r => r.data),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export function useExercise(id: number | undefined) {
  return useQuery({
    queryKey: ['exercises', id],
    queryFn: () => api.get<ExerciseDto>(`/exercises/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
