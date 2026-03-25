import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import type { WorkoutLogDto, WorkoutLogSummaryDto, CreateWorkoutLogRequest } from '@/types/log'
import type { PageResponse } from '@/types/common'

interface UseLogsParams {
  from?: string
  to?: string
  page: number
  size: number
}

export function useLogs({ from, to, page, size }: UseLogsParams) {
  return useQuery({
    queryKey: ['logs', { from, to, page, size }],
    queryFn: () =>
      api.get<PageResponse<WorkoutLogSummaryDto>>('/logs', {
        params: { from, to, page, size },
      }).then((r) => r.data),
  })
}

export function useLog(id: number | undefined) {
  return useQuery({
    queryKey: ['logs', id],
    queryFn: () => api.get<WorkoutLogDto>(`/logs/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateLog() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (data: CreateWorkoutLogRequest) =>
      api.post<WorkoutLogDto>('/logs', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['logs'] })
      navigate('/history')
    },
  })
}

export function useDeleteLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/logs/${id}`) as Promise<unknown>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['logs'] })
    },
  })
}
