import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'
import type { UserDto } from '@/types/user'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const authRes = await api.post<AuthResponse>('/auth/login', data)
      return authRes.data
    },
    onSuccess: async (auth) => {
      // Fetch user profile right after receiving tokens
      const userRes = await api.get<UserDto>('/users/me', {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      })
      setAuth(auth.accessToken, auth.refreshToken, userRes.data)
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      navigate('/')
    },
  })
}

export function useRegister() {
  const loginMutation = useLogin()

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      await api.post('/auth/register', data)
      return data
    },
    onSuccess: (data) => {
      loginMutation.mutate({ email: data.email, password: data.password })
    },
  })
}

export function useLogout() {
  const { refreshToken, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken }).catch(() => {
          // Ignore errors — always clear locally
        })
      }
    },
    onSettled: () => {
      clearAuth()
      queryClient.clear()
      navigate('/login')
    },
  })
}

export function useCurrentUser() {
  const accessToken = useAuthStore((s) => s.accessToken)

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.get<UserDto>('/users/me').then((r) => r.data),
    enabled: !!accessToken,
  })
}
