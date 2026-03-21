import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useDeletePlan } from '@/hooks/usePlans'
import type { WorkoutPlanDto } from '@/types/plan'

interface PlanCardProps {
  plan: WorkoutPlanDto
}

export function PlanCard({ plan }: PlanCardProps) {
  const navigate = useNavigate()
  const deletePlan = useDeletePlan()

  return (
    <div
      className="relative rounded-xl p-6 cursor-pointer transition-colors group hover:brightness-110"
      style={{ backgroundColor: '#222a3d' }}
      onClick={() => navigate(`/plans/${plan.id}`)}
    >
      {plan.isActive && (
        <span
          className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(137,206,255,0.15)', color: '#89ceff' }}
        >
          Active
        </span>
      )}

      <h3 className="text-lg font-bold mb-1 pr-16" style={{ color: '#dae2fd' }}>
        {plan.name}
      </h3>

      {plan.description && (
        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#bec8d2' }}>
          {plan.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2" style={{ color: '#88929b' }}>
          <span className="material-symbols-outlined text-base">calendar_month</span>
          <span className="text-sm">{plan.sessionCount} session{plan.sessionCount !== 1 ? 's' : ''}</span>
        </div>

        <ConfirmDialog
          title="Delete Plan"
          description={`Delete "${plan.name}"? This will also remove all sessions and exercises.`}
          onConfirm={() => deletePlan.mutate(plan.id)}
        >
          <button
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900/30 cursor-pointer"
            style={{ color: '#ffb4ab' }}
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </ConfirmDialog>
      </div>
    </div>
  )
}
