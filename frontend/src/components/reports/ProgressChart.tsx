import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useProgressData } from '@/hooks/useReports'
import { useAuthStore } from '@/store/authStore'
import { kgToLbs } from '@/lib/utils'

interface Props {
  exerciseId: number | null
  from: string
  to: string
}

export function ProgressChart({ exerciseId, from, to }: Props) {
  const { data, isLoading } = useProgressData(exerciseId, from, to)
  const unitPref = useAuthStore(s => s.user?.unitPref)

  if (!exerciseId) {
    return (
      <div className="py-16 text-center rounded-xl" style={{ backgroundColor: '#131b2e' }}>
        <p className="text-sm" style={{ color: '#88929b' }}>Select an exercise to view progress.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="material-symbols-outlined animate-spin text-4xl" style={{ color: '#89ceff' }}>
          progress_activity
        </span>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-16 text-center rounded-xl" style={{ backgroundColor: '#131b2e' }}>
        <span className="material-symbols-outlined text-5xl mb-3 block" style={{ color: '#3e4850' }}>
          show_chart
        </span>
        <p className="text-sm" style={{ color: '#88929b' }}>No data for this exercise in the selected date range.</p>
      </div>
    )
  }

  const chartData = data.map(point => ({
    date: point.date,
    maxWeight: unitPref === 'LBS' ? kgToLbs(point.maxWeightKg) : point.maxWeightKg,
    totalVolume: unitPref === 'LBS' ? kgToLbs(point.totalVolumeKg) : point.totalVolumeKg,
  }))

  const weightLabel = unitPref === 'LBS' ? 'Max Weight (lbs)' : 'Max Weight (kg)'
  const volumeLabel = unitPref === 'LBS' ? 'Total Volume (lbs)' : 'Total Volume (kg)'

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: '#131b2e' }}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#88929b', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#1e2d45' }}
          />
          <YAxis
            tick={{ fill: '#88929b', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#1e2d45' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0d1626', border: '1px solid #1e2d45', borderRadius: 8 }}
            labelStyle={{ color: '#dae2fd', marginBottom: 4 }}
            itemStyle={{ color: '#bec8d2' }}
            formatter={(value: unknown, name: unknown) => [
              typeof value === 'number' ? `${value.toFixed(1)} ${unitPref === 'LBS' ? 'lbs' : 'kg'}` : String(value),
              String(name ?? ''),
            ]}
          />
          <Legend
            wrapperStyle={{ color: '#88929b', fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="maxWeight"
            name={weightLabel}
            stroke="#89ceff"
            strokeWidth={2}
            dot={{ fill: '#89ceff', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="totalVolume"
            name={volumeLabel}
            stroke="#34d399"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#34d399', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
