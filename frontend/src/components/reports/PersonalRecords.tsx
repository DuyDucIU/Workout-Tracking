import { WeightDisplay } from '@/components/shared/WeightDisplay'
import type { PersonalRecordDto } from '@/types/report'

interface Props {
  records: PersonalRecordDto[]
}

export function PersonalRecords({ records }: Props) {
  if (records.length === 0) {
    return (
      <div className="py-12 text-center rounded-xl" style={{ backgroundColor: '#131b2e' }}>
        <span className="material-symbols-outlined text-5xl mb-3 block" style={{ color: '#3e4850' }}>
          emoji_events
        </span>
        <p className="text-sm" style={{ color: '#88929b' }}>
          No personal records yet. Start logging workouts with weights!
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#131b2e' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid #1e2d45' }}>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#88929b' }}>
              Exercise
            </th>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#88929b' }}>
              Max Weight
            </th>
            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#88929b' }}>
              Date Achieved
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, idx) => (
            <tr
              key={record.exerciseId}
              style={{ borderBottom: idx < records.length - 1 ? '1px solid #1e2d45' : undefined }}
            >
              <td className="px-5 py-3 font-medium" style={{ color: '#dae2fd' }}>
                {record.exerciseName}
              </td>
              <td className="px-5 py-3" style={{ color: '#89ceff' }}>
                <WeightDisplay value={record.maxWeightKg} />
              </td>
              <td className="px-5 py-3" style={{ color: '#bec8d2' }}>
                {record.achievedDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
