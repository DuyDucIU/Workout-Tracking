import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function TopBar() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const navigate = useNavigate()

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? '??'

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* Mobile brand (hidden on md+) */}
      <span className="font-semibold text-slate-800 dark:text-slate-100 md:hidden">
        Workout Tracker
      </span>
      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => logout.mutate()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
