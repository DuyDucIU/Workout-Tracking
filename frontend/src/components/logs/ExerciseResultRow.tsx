import { WeightDisplay } from '@/components/shared/WeightDisplay'

interface ExerciseResultRowProps {
  exerciseName: string
  exerciseId: number
  targetSets: number
  targetReps: number
  targetWeightKg: number | null
  actualSets: number
  actualReps: number
  actualWeightKg: string
  notes: string
  onChangeSets: (v: number) => void
  onChangeReps: (v: number) => void
  onChangeWeight: (v: string) => void
  onChangeNotes: (v: string) => void
}

export function ExerciseResultRow({
  exerciseName,
  targetSets,
  targetReps,
  targetWeightKg,
  actualSets,
  actualReps,
  actualWeightKg,
  notes,
  onChangeSets,
  onChangeReps,
  onChangeWeight,
  onChangeNotes,
}: ExerciseResultRowProps) {
  return (
    <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#131b2e' }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: '#dae2fd' }}>{exerciseName}</p>
        <p className="text-xs" style={{ color: '#88929b' }}>
          Target: {targetSets} × {targetReps}
          {targetWeightKg != null && (
            <> · <WeightDisplay value={targetWeightKg} /></>
          )}
        </p>
      </div>

      <div className={`grid gap-3 ${targetWeightKg != null ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>Sets</p>
          <input
            type="number"
            min={1}
            step={1}
            value={actualSets}
            onChange={e => onChangeSets(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
          />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>Reps</p>
          <input
            type="number"
            min={1}
            step={1}
            value={actualReps}
            onChange={e => onChangeReps(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
          />
        </div>
        {targetWeightKg != null && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>Weight (kg)</p>
            <input
              type="number"
              min={0}
              step={0.5}
              value={actualWeightKg}
              onChange={e => onChangeWeight(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
            />
          </div>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>Notes</p>
        <input
          type="text"
          value={notes}
          onChange={e => onChangeNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
        />
      </div>
    </div>
  )
}
