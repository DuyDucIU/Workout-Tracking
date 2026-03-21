import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useRegister } from '@/hooks/useAuth'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

const schema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

const inputBase =
  'w-full rounded-lg py-4 px-4 text-sm outline-none border-none transition-all placeholder:opacity-50'

export function RegisterForm() {
  const register = useRegister()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', username: '', password: '', confirmPassword: '' },
  })

  const serverError = register.error
    ? (register.error as { response?: { data?: { message?: string } } })
        .response?.data?.message ?? 'Registration failed. Please try again.'
    : undefined

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => register.mutate(v))} className="space-y-5">

        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1"
                style={{ color: '#bec8d2' }}
              >
                Username
              </label>
              <FormControl>
                <div className="relative group">
                  <input
                    {...field}
                    type="text"
                    placeholder="johndoe"
                    autoComplete="username"
                    className={inputBase}
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

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1"
                style={{ color: '#bec8d2' }}
              >
                Email Address
              </label>
              <FormControl>
                <div className="relative group">
                  <input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputBase}
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

        {/* Password + Confirm Password — 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1"
                  style={{ color: '#bec8d2' }}
                >
                  Password
                </label>
                <FormControl>
                  <div className="relative group">
                    <input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={inputBase}
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1"
                  style={{ color: '#bec8d2' }}
                >
                  Confirm Password
                </label>
                <FormControl>
                  <div className="relative group">
                    <input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={inputBase}
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
        </div>

        {/* Server error */}
        {serverError && (
          <p className="text-xs" style={{ color: '#ffb4ab' }}>
            {serverError}
          </p>
        )}

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={register.isPending}
            className="w-full rounded-lg py-4 font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            style={{ background: 'linear-gradient(to right, #89ceff, #0ea5e9)', color: '#00344d' }}
          >
            {register.isPending ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        {/* Login link */}
        <p className="text-sm text-center pt-1" style={{ color: '#bec8d2' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold hover:underline underline-offset-4"
            style={{ color: '#89ceff' }}
          >
            Login
          </Link>
        </p>

        {/* Terms */}
        <p
          className="text-[10px] text-center uppercase tracking-widest pt-2"
          style={{ color: '#4a5568' }}
        >
          By registering you agree to our Terms &amp; Privacy Policy
        </p>
      </form>
    </Form>
  )
}
