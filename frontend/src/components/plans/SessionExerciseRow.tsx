import { useState } from 'react'
import { WeightDisplay } from '@/components/shared/WeightDisplay'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useUpdateSessionExercise, useDeleteSessionExercise } from '@/hooks/useSessions'
import type { SessionExerciseDto, UpdateSessionExerciseRequest } from '@/types/plan'

interface SessionExerciseRowProps {
  sessionExercise: SessionExerciseDto
  planId: number
}

export function SessionExerciseRow({ sessionExercise: se, planId }: SessionExerciseRowProps) {
  const [editing, setEditing] = useState(false)
  const [sets, setSets] = useState(String(se.sets))
  const [reps, setReps] = useState(String(se.reps))
  const [weight, setWeight] = useState(se.weightKg != null ? String(se.weightKg) : '')
  const [notes, setNotes] = useState(se.notes ?? '')
  const updateSe = useUpdateSessionExercise(planId)
  const deleteSe = useDeleteSessionExercise(planId)

  const handleSave = () => {
    const data: UpdateSessionExerciseRequest = {
      sets: Number(sets),
      reps: Number(reps),
      weightKg: weight ? Number(weight) : undefined,
      notes: notes || undefined,
    }
    updateSe.mutate({ id: se.id, data }, { onSuccess: () => setEditing(false) })
  }

  if (editing) {
    return (
      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#131b2e', border: '1px solid #3e4850' }}>
        <p className="text-sm font-semibold" style={{ color: '#dae2fd' }}>{se.exercise.name}</p>
        <div className="grid grid-cols-3 gap-3">
          {(['Sets', 'Reps', 'Weight (kg)'] as const).map((label, i) => {
            const vals = [sets, reps, weight]
            const setters = [setSets, setReps, setWeight]
            return (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>{label}</p>
                <input
                  type="number"
                  value={vals[i]}
                  onChange={e => setters[i](e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
                />
              </div>
            )
          })}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>Notes</p>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Optional notes..."
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={updateSe.isPending}
            className="px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-60"
            style={{ background: 'linear-gradient(to right, #89ceff, #0ea5e9)', color: '#00344d' }}
          >
            {updateSe.isPending ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#bec8d2' }}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg group"
      style={{ backgroundColor: '#131b2e' }}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: '#dae2fd' }}>{se.exercise.name}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs" style={{ color: '#bec8d2' }}>{se.sets} × {se.reps}</span>
          {se.weightKg != null && (
            <span className="text-xs" style={{ color: '#89ceff' }}>
              <WeightDisplay value={se.weightKg} />
            </span>
          )}
          {se.notes && (
            <span className="text-xs truncate" style={{ color: '#88929b' }}>{se.notes}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg hover:bg-white/5"
          style={{ color: '#bec8d2' }}
        >
          <span className="material-symbols-outlined text-base">edit</span>
        </button>
        <ConfirmDialog
          title="Remove Exercise"
          description={`Remove "${se.exercise.name}" from this session?`}
          onConfirm={() => deleteSe.mutate(se.id)}
        >
          <button
            className="p-1.5 rounded-lg hover:bg-red-900/30"
            style={{ color: '#ffb4ab' }}
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </ConfirmDialog>
      </div>
    </div>
  )
}
