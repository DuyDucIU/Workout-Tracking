import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  PlusSquare,
  History,
  BarChart2,
  User,
  Dumbbell,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/plans', label: 'My Plans', icon: ClipboardList },
  { to: '/log', label: 'Log Workout', icon: PlusSquare },
  { to: '/history', label: 'History', icon: History },
  { to: '/reports', label: 'Reports', icon: BarChart2 },
  { to: '/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-sky-500 text-white">
          <Dumbbell className="h-5 w-5" />
        </div>
        <span className="font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          Workout Tracker
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
