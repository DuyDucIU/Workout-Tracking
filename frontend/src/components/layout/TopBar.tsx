import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useLogout } from '@/hooks/useAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useNavigate } from 'react-router-dom'

export function TopBar() {
  const user = useAuthStore((s) => s.user)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const logout = useLogout()
  const navigate = useNavigate()

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? '??'

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-16 py-4 backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(45,52,73,0.6)' }}
    >
      {/* Left — title + search */}
      <div className="flex items-center gap-8">
        <h2
          className="text-2xl font-black tracking-tight"
          style={{ color: '#dae2fd' }}
        >
          Overview
        </h2>
        <div className="relative hidden lg:block">
          <span
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none"
            style={{ color: '#bec8d2' }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search routines or exercises..."
            className="rounded-full pl-12 pr-4 py-2.5 text-sm outline-none w-72"
            style={{
              backgroundColor: '#060e20',
              color: '#dae2fd',
              border: 'none',
            }}
          />
        </div>
      </div>

      {/* Right — actions + user */}
      <div className="flex items-center gap-6">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full transition-colors hover:opacity-80"
          style={{ backgroundColor: '#222a3d' }}
        >
          <span className="material-symbols-outlined text-xl" style={{ color: '#bec8d2' }}>
            dark_mode
          </span>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-full transition-colors hover:opacity-80"
          style={{ backgroundColor: '#222a3d' }}
        >
          <span className="material-symbols-outlined text-xl" style={{ color: '#bec8d2' }}>
            notifications
          </span>
          <span
            className="absolute top-1.5 right-1.5 size-2 rounded-full"
            style={{ backgroundColor: '#ffb86e' }}
          />
        </button>

        {/* User section */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold" style={{ color: '#dae2fd' }}>
              {user?.username}
            </p>
            <p
              className="text-[10px] uppercase tracking-widest"
              style={{ color: '#bec8d2' }}
            >
              Level 24
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="size-10 rounded-full cursor-pointer outline-none">
                <AvatarFallback
                  className="text-xs font-semibold rounded-full ring-2"
                  style={{
                    backgroundColor: '#222a3d',
                    color: '#89ceff',
                    '--tw-ring-color': 'rgba(137,206,255,0.2)',
                  } as React.CSSProperties}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl p-2 shadow-2xl"
              style={{ backgroundColor: '#131b2e', border: '1px solid #3e4850' }}
            >
              {/* User header */}
              <div className="flex items-center gap-3 px-3 py-3">
                <div
                  className="size-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: '#222a3d', color: '#89ceff' }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: '#dae2fd' }}>
                    {user?.username}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#88929b' }}>
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="my-1 mx-2 h-px" style={{ backgroundColor: '#3e4850' }} />

              <DropdownMenuItem
                onClick={() => navigate('/profile')}
                className="rounded-lg px-3 py-2.5 gap-3 cursor-pointer focus:bg-[#222a3d] hover:bg-[#222a3d] focus:text-[#dae2fd]"
                style={{ color: '#dae2fd' }}
              >
                <span className="material-symbols-outlined text-lg" style={{ color: '#bec8d2' }}>
                  person
                </span>
                <span className="text-sm font-medium">Profile</span>
              </DropdownMenuItem>

              <div className="my-1 mx-2 h-px" style={{ backgroundColor: '#3e4850' }} />

              <DropdownMenuItem
                onClick={() => logout.mutate()}
                className="rounded-lg px-3 py-2.5 gap-3 cursor-pointer focus:bg-[#222a3d] hover:bg-[#222a3d]"
                style={{ color: '#ffb4ab' }}
              >
                <span className="material-symbols-outlined text-lg" style={{ color: '#ffb4ab' }}>
                  logout
                </span>
                <span className="text-sm font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
