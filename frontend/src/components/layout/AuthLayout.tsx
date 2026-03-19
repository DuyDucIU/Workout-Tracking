import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Dumbbell } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo + App name */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-sky-500 text-white">
              <Dumbbell className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Workout Tracker
            </h1>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
