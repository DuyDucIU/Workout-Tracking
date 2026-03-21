import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import type { CreatePlanRequest, WorkoutPlanDto } from '@/types/plan'

const planSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

type PlanFormValues = z.infer<typeof planSchema>

interface PlanFormProps {
  onSubmit: (values: CreatePlanRequest) => void
  isPending?: boolean
  defaultValues?: Partial<WorkoutPlanDto>
  submitLabel?: string
}

const inputClass = 'w-full rounded-xl py-3 px-4 text-sm outline-none transition-all'

export function PlanForm({ onSubmit, isPending, defaultValues, submitLabel = 'Create Plan' }: PlanFormProps) {
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      isActive: defaultValues?.isActive ?? false,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: '#bec8d2' }}>
                Plan Name
              </FormLabel>
              <FormControl>
                <input
                  {...field}
                  placeholder="e.g. Push / Pull / Legs"
                  className={inputClass}
                  style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
                />
              </FormControl>
              <FormMessage className="text-xs" style={{ color: '#ffb4ab' }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest" style={{ color: '#bec8d2' }}>
                Description <span className="normal-case tracking-normal font-normal opacity-60">(optional)</span>
              </FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={3}
                  placeholder="What's this plan about?"
                  className={`${inputClass} resize-none`}
                  style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
                />
              </FormControl>
              <FormMessage className="text-xs" style={{ color: '#ffb4ab' }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ backgroundColor: '#060e20' }}
            >
              <div>
                <FormLabel className="text-sm font-semibold" style={{ color: '#dae2fd' }}>
                  Set as active plan
                </FormLabel>
                <p className="text-xs mt-0.5" style={{ color: '#88929b' }}>
                  Your active plan appears on the dashboard
                </p>
              </div>
              <FormControl>
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: field.value ? '#0ea5e9' : '#3e4850' }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform"
                    style={{ transform: field.value ? 'translateX(20px)' : 'translateX(0)' }}
                  />
                </button>
              </FormControl>
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl py-3.5 font-black uppercase tracking-tight transition-all hover:brightness-110 disabled:opacity-60 cursor-pointer"
          style={{ background: 'linear-gradient(to bottom right, #89ceff, #0ea5e9)', color: '#00344d' }}
        >
          {isPending ? 'Saving...' : submitLabel}
        </button>
      </form>
    </Form>
  )
}
