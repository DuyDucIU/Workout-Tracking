import { useAuthStore } from '@/store/authStore'
import { kgToLbs } from '@/lib/utils'

interface WeightDisplayProps {
  value: number | null | undefined
  className?: string
}

export function WeightDisplay({ value, className }: WeightDisplayProps) {
  const unitPref = useAuthStore(s => s.user?.unitPref)

  if (value == null) return <span className={className}>—</span>

  if (unitPref === 'LBS') {
    return <span className={className}>{kgToLbs(value).toFixed(1)} lbs</span>
  }
  return <span className={className}>{value} kg</span>
}
