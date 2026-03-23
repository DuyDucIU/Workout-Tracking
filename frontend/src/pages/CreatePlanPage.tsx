import { Link } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { useCreatePlan } from '@/hooks/usePlans'
import { PlanForm } from '@/components/plans/PlanForm'

export function CreatePlanPage() {
  const createPlan = useCreatePlan()

  return (
    <div className="px-8 py-8 max-w-2xl mx-auto">
      <Link
        to="/plans"
        className="flex items-center gap-1 text-sm mb-8 hover:opacity-70 transition-opacity"
        style={{ color: '#bec8d2' }}
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Plans
      </Link>

      <div className="rounded-xl p-8" style={{ backgroundColor: '#131b2e' }}>
        <h1 className="text-2xl font-black tracking-tight mb-2" style={{ color: '#dae2fd' }}>
          New Workout Plan
        </h1>
        <p className="text-sm mb-8" style={{ color: '#bec8d2' }}>
          Give your plan a name and description to get started.
        </p>

        {createPlan.error && (
          <div
            className="rounded-lg p-3 text-sm mb-6 border"
            style={{ backgroundColor: 'rgba(147,0,10,0.3)', color: '#ffdad6', borderColor: 'rgba(255,180,171,0.2)' }}
          >
            {(createPlan.error as AxiosError<{ message?: string }>)?.response?.data?.message
              ?? 'Failed to create plan. Please try again.'}
          </div>
        )}

        <PlanForm onSubmit={createPlan.mutate} isPending={createPlan.isPending} />
      </div>
    </div>
  )
}
