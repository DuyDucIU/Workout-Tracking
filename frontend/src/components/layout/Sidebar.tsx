import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/plans', label: 'Plans', icon: 'fitness_center' },
  { to: '/log', label: 'Log Workout', icon: 'edit_note' },
  { to: '/history', label: 'History', icon: 'history' },
  { to: '/reports', label: 'Reports', icon: 'monitoring' },
  { to: '/profile', label: 'Settings', icon: 'settings' },
]

export function Sidebar() {
  return (
    <aside
      className="hidden md:flex flex-col w-72 min-h-screen sticky top-0 h-screen"
      style={{ backgroundColor: '#0b1326' }}
    >
      {/* Branding */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div
          className="size-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: '#0ea5e9', color: '#00344d' }}
        >
          <span className="material-symbols-outlined text-xl">exercise</span>
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: '#dae2fd' }}>
            Kinetic
          </p>
          <p className="text-xs" style={{ color: '#bec8d2' }}>
            Premium Member
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-[#222a3d]' : 'hover:bg-[#171f33]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-xl"
                  style={{
                    color: isActive ? '#89ceff' : '#bec8d2',
                    fontVariationSettings: isActive && icon === 'dashboard' ? "'FILL' 1" : undefined,
                  }}
                >
                  {icon}
                </span>
                <span style={{ color: isActive ? '#89ceff' : '#bec8d2' }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
