import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import type { WorkoutPlanDto, CreatePlanRequest, UpdatePlanRequest } from '@/types/plan'

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get<WorkoutPlanDto[]>('/workout-plans').then((r) => r.data),
  })
}

export function usePlan(id: number | undefined) {
  return useQuery({
    queryKey: ['plans', id],
    queryFn: () => api.get<WorkoutPlanDto>(`/workout-plans/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreatePlan() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (data: CreatePlanRequest) =>
      api.post<WorkoutPlanDto>('/workout-plans', data).then((r) => r.data),
    onSuccess: (plan: WorkoutPlanDto) => {
      qc.invalidateQueries({ queryKey: ['plans'] })
      navigate(`/plans/${plan.id}`)
    },
  })
}

export function useUpdatePlan(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdatePlanRequest) =>
      api.patch<WorkoutPlanDto>(`/workout-plans/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plans', id] })
      qc.invalidateQueries({ queryKey: ['plans'] })
    },
  })
}

export function useDeletePlan() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/workout-plans/${id}`) as Promise<unknown>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plans'] })
      navigate('/plans')
    },
  })
}
