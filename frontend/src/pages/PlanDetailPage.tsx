import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePlan, useUpdatePlan, useDeletePlan } from '@/hooks/usePlans'
import { useCreateSession } from '@/hooks/useSessions'
import { SessionCard } from '@/components/plans/SessionCard'
import { PlanForm } from '@/components/plans/PlanForm'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { CreateSessionRequest, WorkoutDayOfWeek } from '@/types/plan'

const DAY_OPTIONS: WorkoutDayOfWeek[] = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
const DAY_LABELS: Record<WorkoutDayOfWeek, string> = {
  MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday',
}

const sessionSchema = z.object({
  name: z.string().min(1, 'Session name is required'),
  dayOfWeek: z.enum(['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']).optional(),
})
type SessionFormValues = z.infer<typeof sessionSchema>

export function PlanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const planId = Number(id)
  const { data: plan, isLoading } = usePlan(planId)
  const updatePlan = useUpdatePlan(planId)
  const deletePlan = useDeletePlan()
  const createSession = useCreateSession(planId)
  const [editingPlan, setEditingPlan] = useState(false)
  const [addingSession, setAddingSession] = useState(false)

  const sessionForm = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { name: '' },
  })

  const handleAddSession = (values: SessionFormValues) => {
    const req: CreateSessionRequest = {
      name: values.name,
      dayOfWeek: values.dayOfWeek,
    }
    createSession.mutate(req, {
      onSuccess: () => { setAddingSession(false); sessionForm.reset() },
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="material-symbols-outlined animate-spin text-4xl" style={{ color: '#89ceff' }}>progress_activity</span>
      </div>
    )
  }

  if (!plan) {
    return <div className="px-8 py-8 text-center" style={{ color: '#bec8d2' }}>Plan not found.</div>
  }

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
      <Link to="/plans" className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity" style={{ color: '#bec8d2' }}>
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Plans
      </Link>

      {/* Plan header */}
      {editingPlan ? (
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: '#131b2e' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#dae2fd' }}>Edit Plan</h2>
          <PlanForm
            onSubmit={(values) => updatePlan.mutate(values, { onSuccess: () => setEditingPlan(false) })}
            isPending={updatePlan.isPending}
            defaultValues={plan}
            submitLabel="Save Changes"
          />
          <button onClick={() => setEditingPlan(false)} className="mt-3 text-sm" style={{ color: '#88929b' }}>Cancel</button>
        </div>
      ) : (
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: '#131b2e' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black tracking-tight" style={{ color: '#dae2fd' }}>{plan.name}</h1>
                {plan.isActive && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(137,206,255,0.15)', color: '#89ceff' }}>
                    Active
                  </span>
                )}
              </div>
              {plan.description && <p className="text-sm" style={{ color: '#bec8d2' }}>{plan.description}</p>}
              <p className="text-xs mt-2" style={{ color: '#88929b' }}>{plan.sessionCount} session{plan.sessionCount !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingPlan(true)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: '#bec8d2' }}>
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
              <ConfirmDialog
                title="Delete Plan"
                description={`Delete "${plan.name}" and all its sessions?`}
                onConfirm={() => deletePlan.mutate(plan.id)}
              >
                <button className="p-2 rounded-lg hover:bg-red-900/30" style={{ color: '#ffb4ab' }}>
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </ConfirmDialog>
            </div>
          </div>
        </div>
      )}

      {/* Sessions header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: '#dae2fd' }}>Sessions</h2>
        {!addingSession && (
          <button
            onClick={() => setAddingSession(true)}
            className="flex items-center gap-1 text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: '#89ceff' }}
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add Session
          </button>
        )}
      </div>

      {/* Add session form */}
      {addingSession && (
        <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: '#131b2e', border: '1px solid #3e4850' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#dae2fd' }}>New Session</h3>
          <Form {...sessionForm}>
            <form onSubmit={sessionForm.handleSubmit(handleAddSession)} className="space-y-4">
              <FormField
                control={sessionForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: '#bec8d2' }}>Session Name</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="e.g. Push Day"
                        className="w-full rounded-xl py-3 px-4 text-sm outline-none"
                        style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" style={{ color: '#ffb4ab' }} />
                  </FormItem>
                )}
              />
              <FormField
                control={sessionForm.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: '#bec8d2' }}>
                      Day of Week <span className="normal-case font-normal opacity-60">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <select
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value ?? ''}
                        onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                        className="w-full rounded-xl py-3 px-4 text-sm outline-none"
                        style={{ backgroundColor: '#060e20', color: field.value ? '#dae2fd' : '#88929b' }}
                      >
                        <option value="">No specific day</option>
                        {DAY_OPTIONS.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              {createSession.error && (
                <div
                  className="rounded-lg p-3 text-sm border"
                  style={{ backgroundColor: 'rgba(147,0,10,0.3)', color: '#ffdad6', borderColor: 'rgba(255,180,171,0.2)' }}
                >
                  Failed to add session. Please try again.
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createSession.isPending}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 disabled:opacity-60"
                  style={{ background: 'linear-gradient(to right, #89ceff, #0ea5e9)', color: '#00344d' }}
                >
                  {createSession.isPending ? 'Adding...' : 'Add Session'}
                </button>
                <button
                  type="button"
                  onClick={() => { setAddingSession(false); sessionForm.reset() }}
                  className="text-sm px-3"
                  style={{ color: '#88929b' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Empty sessions */}
      {plan.sessions?.length === 0 && !addingSession && (
        <div className="py-16 text-center rounded-xl" style={{ backgroundColor: '#131b2e' }}>
          <span className="material-symbols-outlined text-5xl mb-3 block" style={{ color: '#3e4850' }}>event_note</span>
          <p className="text-sm" style={{ color: '#88929b' }}>No sessions yet. Add your first session above.</p>
        </div>
      )}

      {/* Sessions list */}
      <div className="space-y-3">
        {plan.sessions?.map((session) => (
          <SessionCard key={session.id} session={session} planId={planId} />
        ))}
      </div>
    </div>
  )
}
