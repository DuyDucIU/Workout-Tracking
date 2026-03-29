import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ProgressDataPointDto, SummaryStatsDto, PersonalRecordDto } from '@/types/report'

export function useSummaryStats() {
  return useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: () => api.get<SummaryStatsDto>('/reports/summary').then(r => r.data),
  })
}

export function usePersonalRecords() {
  return useQuery({
    queryKey: ['reports', 'records'],
    queryFn: () => api.get<PersonalRecordDto[]>('/reports/records').then(r => r.data),
  })
}

export function useProgressData(exerciseId: number | null, from: string, to: string) {
  return useQuery({
    queryKey: ['reports', 'progress', exerciseId, from, to],
    queryFn: () =>
      api.get<ProgressDataPointDto[]>(`/reports/progress/${exerciseId!}`, {
        params: { from, to },
      }).then(r => r.data),
    enabled: !!exerciseId && !!from && !!to,
  })
}
