import { useState } from 'react'
import { ExercisePicker } from './ExercisePicker'
import { SessionExerciseRow } from './SessionExerciseRow'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useDeleteSession, useCreateSessionExercise } from '@/hooks/useSessions'
import type { SessionDto } from '@/types/plan'
import type { ExerciseDto } from '@/types/exercise'

const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed', THURSDAY: 'Thu',
  FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
}

interface SessionCardProps {
  session: SessionDto
  planId: number
}

export function SessionCard({ session, planId }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [addingExercise, setAddingExercise] = useState(false)
  const deleteSession = useDeleteSession(planId)
  const addExercise = useCreateSessionExercise(planId)

  const handleSelectExercise = (exercise: ExerciseDto) => {
    addExercise.mutate(
      { sessionId: session.id, data: { exerciseId: exercise.id, sets: 3, reps: 10 } },
      { onSuccess: () => setAddingExercise(false) }
    )
  }

  return (
    <div className="rounded-xl" style={{ backgroundColor: '#222a3d' }}>
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-lg transition-transform"
            style={{ color: '#89ceff', transform: expanded ? 'rotate(90deg)' : 'none' }}
          >
            chevron_right
          </span>
          <div>
            <p className="font-semibold" style={{ color: '#dae2fd' }}>{session.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {session.dayOfWeek && (
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(137,206,255,0.12)', color: '#89ceff' }}
                >
                  {DAY_LABELS[session.dayOfWeek]}
                </span>
              )}
              <span className="text-xs" style={{ color: '#88929b' }}>
                {session.exercises.length} exercise{session.exercises.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <ConfirmDialog
          title="Delete Session"
          description={`Delete "${session.name}" and all its exercises?`}
          onConfirm={() => deleteSession.mutate(session.id)}
        >
          <button
            className="p-1.5 rounded-lg hover:bg-red-900/30 transition-colors cursor-pointer"
            style={{ color: '#ffb4ab' }}
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </ConfirmDialog>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-2 pt-3" style={{ borderTop: '1px solid #3e4850' }}>
          {session.exercises.length === 0 && !addingExercise && (
            <p className="text-sm py-4 text-center" style={{ color: '#88929b' }}>No exercises yet.</p>
          )}

          {session.exercises.map(se => (
            <SessionExerciseRow key={se.id} sessionExercise={se} planId={planId} />
          ))}

          {addingExercise ? (
            <div className="pt-3">
              <ExercisePicker onSelect={handleSelectExercise} />
              <button
                onClick={() => setAddingExercise(false)}
                className="mt-2 text-xs"
                style={{ color: '#88929b' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingExercise(true)}
              className="mt-3 flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
              style={{ color: '#89ceff' }}
            >
              <span className="material-symbols-outlined text-base">add</span>
              Add Exercise
            </button>
          )}
        </div>
      )}
    </div>
  )
}
