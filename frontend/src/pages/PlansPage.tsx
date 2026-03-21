import { Link } from 'react-router-dom'
import { usePlans } from '@/hooks/usePlans'
import { PlanCard } from '@/components/plans/PlanCard'

export function PlansPage() {
  const { data: plans, isLoading } = usePlans()

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#dae2fd' }}>My Plans</h1>
          <p className="text-sm mt-1" style={{ color: '#bec8d2' }}>Build and manage your workout routines</p>
        </div>
        <Link
          to="/plans/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:brightness-110 hover:shadow-[0_8px_25px_rgba(14,165,233,0.35)]"
          style={{ background: 'linear-gradient(to bottom right, #89ceff, #0ea5e9)', color: '#00344d' }}
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Plan
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl" style={{ color: '#89ceff' }}>progress_activity</span>
        </div>
      )}

      {!isLoading && plans?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl mb-4" style={{ color: '#3e4850' }}>fitness_center</span>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#dae2fd' }}>No plans yet</h2>
          <p className="text-sm mb-6" style={{ color: '#bec8d2' }}>Create your first workout plan to get started.</p>
          <Link
            to="/plans/new"
            className="px-6 py-3 rounded-xl font-bold text-sm"
            style={{ background: 'linear-gradient(to right, #89ceff, #0ea5e9)', color: '#00344d' }}
          >
            Create Plan
          </Link>
        </div>
      )}

      {plans && plans.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  )
}
