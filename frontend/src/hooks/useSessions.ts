import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type {
  SessionDto,
  CreateSessionRequest,
  UpdateSessionRequest,
  SessionExerciseDto,
  CreateSessionExerciseRequest,
  UpdateSessionExerciseRequest,
} from '@/types/plan'

export function useCreateSession(planId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSessionRequest) =>
      api.post<SessionDto>(`/workout-plans/${planId}/sessions`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plans', planId] }),
  })
}

export function useUpdateSession(planId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSessionRequest }) =>
      api.patch<SessionDto>(`/sessions/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plans', planId] }),
  })
}

export function useDeleteSession(planId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/sessions/${id}`) as Promise<unknown>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plans', planId] }),
  })
}

export function useCreateSessionExercise(planId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: number; data: CreateSessionExerciseRequest }) =>
      api.post<SessionExerciseDto>(`/sessions/${sessionId}/exercises`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plans', planId] }),
  })
}

export function useUpdateSessionExercise(planId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSessionExerciseRequest }) =>
      api.patch<SessionExerciseDto>(`/session-exercises/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plans', planId] }),
  })
}

export function useDeleteSessionExercise(planId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/session-exercises/${id}`) as Promise<unknown>,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plans', planId] }),
  })
}
