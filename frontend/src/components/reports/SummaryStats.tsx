import { useAuthStore } from '@/store/authStore'
import { kgToLbs } from '@/lib/utils'
import type { SummaryStatsDto } from '@/types/report'

interface Props {
  stats: SummaryStatsDto
}

export function SummaryStats({ stats }: Props) {
  const unitPref = useAuthStore(s => s.user?.unitPref)

  const volumeValue = unitPref === 'LBS'
    ? kgToLbs(stats.totalVolumeKg).toLocaleString(undefined, { maximumFractionDigits: 1 })
    : Number(stats.totalVolumeKg).toLocaleString(undefined, { maximumFractionDigits: 1 })
  const volumeUnit = unitPref === 'LBS' ? 'lbs' : 'kg'

  const cards = [
    { label: 'Total Workouts', value: stats.totalWorkouts.toString(), unit: '' },
    { label: 'Total Volume', value: volumeValue, unit: volumeUnit },
    { label: 'Current Streak', value: stats.currentStreak.toString(), unit: 'days' },
    { label: 'Longest Streak', value: stats.longestStreak.toString(), unit: 'days' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map(card => (
        <div
          key={card.label}
          className="rounded-xl p-5"
          style={{ backgroundColor: '#131b2e' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#88929b' }}>
            {card.label}
          </p>
          <p className="text-3xl font-black" style={{ color: '#89ceff' }}>
            {card.value}
          </p>
          {card.unit && (
            <p className="text-xs mt-1" style={{ color: '#88929b' }}>{card.unit}</p>
          )}
        </div>
      ))}
    </div>
  )
}
