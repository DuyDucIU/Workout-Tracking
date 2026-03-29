import { useState } from 'react'
import { useSummaryStats, usePersonalRecords } from '@/hooks/useReports'
import { useExercises } from '@/hooks/useExercises'
import { SummaryStats } from '@/components/reports/SummaryStats'
import { PersonalRecords } from '@/components/reports/PersonalRecords'
import { ProgressChart } from '@/components/reports/ProgressChart'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type Tab = 'overview' | 'progress'

function defaultDateRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 90)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null)
  const [exerciseSearch, setExerciseSearch] = useState('')
  const defaults = defaultDateRange()
  const [from, setFrom] = useState(defaults.from)
  const [to, setTo] = useState(defaults.to)

  const { data: summaryStats, isLoading: summaryLoading } = useSummaryStats()
  const { data: personalRecords, isLoading: recordsLoading } = usePersonalRecords()
  const { data: exercisePage } = useExercises({ search: exerciseSearch, size: 50 })

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'progress', label: 'Progress' },
  ]

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black tracking-tight mb-6" style={{ color: '#dae2fd' }}>
        Reports
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={
              activeTab === tab.key
                ? { backgroundColor: '#1e2d45', color: '#dae2fd' }
                : { color: '#88929b' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {summaryLoading && <LoadingSpinner size="lg" className="py-12" />}
          {summaryStats && <SummaryStats stats={summaryStats} />}

          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#dae2fd' }}>
              Personal Records
            </h2>
            {recordsLoading && <LoadingSpinner size="lg" className="py-8" />}
            {personalRecords && <PersonalRecords records={personalRecords} />}
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Exercise selector */}
            <div className="flex-1 min-w-48">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>
                Exercise
              </p>
              <input
                type="text"
                placeholder="Search exercises..."
                value={exerciseSearch}
                onChange={e => setExerciseSearch(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none mb-2"
                style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
              />
              <select
                value={selectedExerciseId ?? ''}
                onChange={e => setSelectedExerciseId(e.target.value ? Number(e.target.value) : null)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
              >
                <option value="">-- Select exercise --</option>
                {exercisePage?.content.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            </div>

            {/* Date range */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>
                From
              </p>
              <input
                type="date"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>
                To
              </p>
              <input
                type="date"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
              />
            </div>
          </div>

          <ProgressChart exerciseId={selectedExerciseId} from={from} to={to} />
        </div>
      )}
    </div>
  )
}
