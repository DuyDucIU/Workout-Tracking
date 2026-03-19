import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserDto } from '@/types/user'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserDto | null
  setAuth: (accessToken: string, refreshToken: string, user: UserDto) => void
  updateUser: (user: UserDto) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),

      updateUser: (user) => set({ user }),

      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'workout-auth',
    }
  )
)
