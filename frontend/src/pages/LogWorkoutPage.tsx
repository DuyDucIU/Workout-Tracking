import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlans } from '@/hooks/usePlans'
import { useCreateLog } from '@/hooks/useLogs'
import { LogEntryForm } from '@/components/logs/LogEntryForm'
import type { WorkoutPlanDto, SessionDto } from '@/types/plan'
import type { AxiosError } from 'axios'

export function LogWorkoutPage() {
  const { data: plans, isLoading } = usePlans()
  const createLog = useCreateLog()
  // undefined = "not yet chosen by user"; null = "user explicitly cleared"
  const [selectedPlanId, setSelectedPlanId] = useState<number | undefined>(undefined)
  const [selectedSession, setSelectedSession] = useState<SessionDto | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Derive the selected plan: if user has not made a choice yet, auto-pick the active plan
  const selectedPlan: WorkoutPlanDto | null =
    plans?.find(p => (selectedPlanId !== undefined ? p.id === selectedPlanId : p.isActive)) ?? null

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="material-symbols-outlined animate-spin text-4xl" style={{ color: '#89ceff' }}>progress_activity</span>
      </div>
    )
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="px-8 py-16 text-center">
        <span className="material-symbols-outlined text-5xl mb-3 block" style={{ color: '#3e4850' }}>fitness_center</span>
        <p className="text-sm mb-4" style={{ color: '#88929b' }}>You need a workout plan before you can log a workout.</p>
        <Link
          to="/plans/new"
          className="px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-110"
          style={{ background: 'linear-gradient(to right, #89ceff, #0ea5e9)', color: '#00344d' }}
        >
          Create a Plan
        </Link>
      </div>
    )
  }

  return (
    <div className="px-8 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-black tracking-tight mb-8" style={{ color: '#dae2fd' }}>Log Workout</h1>

      {/* Step 1: Select Plan */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#88929b' }}>Select Plan</p>
        <div className="flex flex-wrap gap-2">
          {plans.map(plan => (
            <button
              key={plan.id}
              onClick={() => { setSelectedPlanId(plan.id); setSelectedSession(null); setError(null) }}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{
                backgroundColor: selectedPlan?.id === plan.id ? 'rgba(137,206,255,0.15)' : '#222a3d',
                color: selectedPlan?.id === plan.id ? '#89ceff' : '#bec8d2',
                border: selectedPlan?.id === plan.id ? '1px solid rgba(137,206,255,0.3)' : '1px solid transparent',
              }}
            >
              {plan.name}
              {plan.isActive && (
                <span className="ml-2 text-[10px] font-bold uppercase tracking-widest opacity-60">Active</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Select Session */}
      {selectedPlan && (
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#88929b' }}>Select Session</p>
          {selectedPlan.sessions.length === 0 ? (
            <p className="text-sm py-4" style={{ color: '#88929b' }}>
              This plan has no sessions.{' '}
              <Link to={`/plans/${selectedPlan.id}`} className="underline" style={{ color: '#89ceff' }}>
                Add sessions first
              </Link>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedPlan.sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => { setSelectedSession(session); setError(null) }}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selectedSession?.id === session.id ? 'rgba(137,206,255,0.15)' : '#222a3d',
                    color: selectedSession?.id === session.id ? '#89ceff' : '#bec8d2',
                    border: selectedSession?.id === session.id ? '1px solid rgba(137,206,255,0.3)' : '1px solid transparent',
                  }}
                >
                  {session.name}
                  <span className="ml-2 text-xs opacity-60">{session.exercises.length} exercises</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Fill Actuals */}
      {selectedPlan && selectedSession && (
        <>
          {selectedSession.exercises.length === 0 ? (
            <p className="text-sm py-4" style={{ color: '#88929b' }}>
              This session has no exercises.{' '}
              <Link to={`/plans/${selectedPlan.id}`} className="underline" style={{ color: '#89ceff' }}>
                Add exercises first
              </Link>
            </p>
          ) : (
            <LogEntryForm
              planId={selectedPlan.id}
              session={selectedSession}
              isPending={createLog.isPending}
              error={error}
              onSubmit={(data) => {
                setError(null)
                createLog.mutate(data, {
                  onError: (err: unknown) => {
                    const axiosErr = err as AxiosError<{ message?: string }>
                    setError(axiosErr.response?.data?.message ?? 'Failed to log workout. Please try again.')
                  },
                })
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
