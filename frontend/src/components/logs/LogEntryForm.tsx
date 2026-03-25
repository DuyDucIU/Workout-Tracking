import { useState } from 'react'
import { ExerciseResultRow } from './ExerciseResultRow'
import type { SessionDto } from '@/types/plan'
import type { CreateWorkoutLogRequest } from '@/types/log'

interface EntryState {
  exerciseId: number
  exerciseName: string
  targetSets: number
  targetReps: number
  targetWeightKg: number | null
  actualSets: number
  actualReps: number
  actualWeightKg: string
  notes: string
}

interface LogEntryFormProps {
  planId: number
  session: SessionDto
  isPending: boolean
  onSubmit: (data: CreateWorkoutLogRequest) => void
  error: string | null
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function LogEntryForm({ planId, session, isPending, onSubmit, error }: LogEntryFormProps) {
  const [completedDate, setCompletedDate] = useState(formatDate(new Date()))
  const [logNotes, setLogNotes] = useState('')
  const [entries, setEntries] = useState<EntryState[]>(() =>
    session.exercises.map(se => ({
      exerciseId: se.exercise.id,
      exerciseName: se.exercise.name,
      targetSets: se.sets,
      targetReps: se.reps,
      targetWeightKg: se.weightKg,
      actualSets: se.sets,
      actualReps: se.reps,
      actualWeightKg: se.weightKg != null ? String(se.weightKg) : '',
      notes: '',
    }))
  )

  const updateEntry = (index: number, patch: Partial<EntryState>) => {
    setEntries(prev => prev.map((e, i) => i === index ? { ...e, ...patch } : e))
  }

  const handleSubmit = () => {
    const data: CreateWorkoutLogRequest = {
      planId,
      sessionId: session.id,
      completedDate,
      notes: logNotes || undefined,
      entries: entries.map(e => ({
        exerciseId: e.exerciseId,
        actualSets: e.actualSets,
        actualReps: e.actualReps,
        actualWeightKg: e.actualWeightKg !== '' ? Number(e.actualWeightKg) : undefined,
        notes: e.notes || undefined,
      })),
    }
    onSubmit(data)
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>Date</p>
        <input
          type="date"
          value={completedDate}
          onChange={e => setCompletedDate(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
        />
      </div>

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <ExerciseResultRow
            key={entry.exerciseId}
            exerciseName={entry.exerciseName}
            exerciseId={entry.exerciseId}
            targetSets={entry.targetSets}
            targetReps={entry.targetReps}
            targetWeightKg={entry.targetWeightKg}
            actualSets={entry.actualSets}
            actualReps={entry.actualReps}
            actualWeightKg={entry.actualWeightKg}
            notes={entry.notes}
            onChangeSets={v => updateEntry(i, { actualSets: v })}
            onChangeReps={v => updateEntry(i, { actualReps: v })}
            onChangeWeight={v => updateEntry(i, { actualWeightKg: v })}
            onChangeNotes={v => updateEntry(i, { notes: v })}
          />
        ))}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>Session Notes</p>
        <textarea
          value={logNotes}
          onChange={e => setLogNotes(e.target.value)}
          placeholder="How did the session go?"
          rows={3}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
          style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
        />
      </div>

      {error && (
        <div
          className="rounded-lg p-3 text-sm border"
          style={{ backgroundColor: 'rgba(147,0,10,0.3)', color: '#ffdad6', borderColor: 'rgba(255,180,171,0.2)' }}
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || entries.length === 0}
        className="px-6 py-3 rounded-xl text-sm font-bold hover:brightness-110 disabled:opacity-60"
        style={{ background: 'linear-gradient(to right, #89ceff, #0ea5e9)', color: '#00344d' }}
      >
        {isPending ? 'Saving...' : 'Log Workout'}
      </button>
    </div>
  )
}
