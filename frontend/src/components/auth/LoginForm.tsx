import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { useLogin } from '@/hooks/useAuth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const login = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values)
  }

  const inputClass =
    'w-full rounded-xl py-4 pl-12 pr-4 text-sm outline-none transition-all placeholder:opacity-50'

  return (
    <>
      {/* Card heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#dae2fd' }}>
          Welcome Back
        </h2>
        <p className="text-sm mt-1" style={{ color: '#bec8d2' }}>
          Access your personalized training metrics
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Server error */}
          {login.error && (
            <div
              className="rounded-lg p-3 text-sm border"
              style={{
                backgroundColor: 'rgba(147,0,10,0.3)',
                color: '#ffdad6',
                borderColor: 'rgba(255,180,171,0.2)',
              }}
            >
              {(login.error as AxiosError<{ message?: string }>)?.response?.data?.message
                ?? (login.error as AxiosError)?.message
                ?? 'Login failed. Please try again.'}
            </div>
          )}

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1"
                  style={{ color: '#bec8d2' }}
                >
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none transition-colors text-[#88929b] group-focus-within:text-[#89ceff]"
                    >
                      mail
                    </span>
                    <input
                      {...field}
                      type="email"
                      placeholder="alex.rivera@pro.com"
                      className={inputClass}
                      style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
                    />
                    <div
                      className="absolute bottom-0 left-0 h-[2px] w-0 group-focus-within:w-full transition-all duration-300 rounded-full"
                      style={{ backgroundColor: '#89ceff' }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs mt-1" style={{ color: '#ffb4ab' }} />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center mb-2 px-1">
                  <FormLabel
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: '#bec8d2' }}
                  >
                    Password
                  </FormLabel>
                  <a
                    href="#"
                    className="text-xs font-bold uppercase tracking-tighter hover:opacity-80 transition-opacity"
                    style={{ color: '#89ceff' }}
                  >
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <div className="relative group">
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none transition-colors text-[#88929b] group-focus-within:text-[#89ceff]"
                    >
                      lock
                    </span>
                    <input
                      {...field}
                      type="password"
                      placeholder="••••••••••••"
                      className={inputClass}
                      style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
                    />
                    <div
                      className="absolute bottom-0 left-0 h-[2px] w-0 group-focus-within:w-full transition-all duration-300 rounded-full"
                      style={{ backgroundColor: '#89ceff' }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs mt-1" style={{ color: '#ffb4ab' }} />
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full rounded-xl py-4 font-black uppercase tracking-tight flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg hover:brightness-110 hover:shadow-[0_8px_25px_rgba(14,165,233,0.45)] cursor-pointer"
              style={{ background: 'linear-gradient(to bottom right, #89ceff, #0ea5e9)', color: '#00344d' }}
            >
              {login.isPending ? 'Signing In...' : 'Sign In'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </form>
      </Form>

      {/* Register link */}
      <div className="mt-10 pt-8 border-t text-center" style={{ borderColor: 'rgba(62,72,80,0.1)' }}>
        <p className="text-sm" style={{ color: '#bec8d2' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold hover:underline underline-offset-4 ml-1"
            style={{ color: '#89ceff' }}
          >
            Register
          </Link>
        </p>
      </div>
    </>
  )
}
