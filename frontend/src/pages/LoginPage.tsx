import { LoginForm } from '@/components/auth/LoginForm'

export function LoginPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#0b1326', color: '#dae2fd' }}
    >
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ background: 'rgba(14,165,233,0.1)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ background: 'rgba(222,135,18,0.05)' }}
      />

      {/* Content */}
      <main className="relative z-10 w-full max-w-[480px]">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2" style={{ color: '#dae2fd' }}>
            Workout Tracker
          </h1>
          <p className="text-sm font-medium tracking-wide uppercase opacity-80" style={{ color: '#bec8d2' }}>
            Push beyond your limits
          </p>
        </div>

        {/* Glassmorphism card */}
        <div
          className="backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-2xl border"
          style={{ backgroundColor: 'rgba(34,42,61,0.6)', borderColor: 'rgba(62,72,80,0.1)' }}
        >
          <LoginForm />
        </div>

        {/* Icon badges */}
        <div className="mt-8 flex justify-center gap-8 opacity-40">
          {[
            { icon: 'bolt', label: 'Power' },
            { icon: 'speed', label: 'Speed' },
            { icon: 'monitoring', label: 'Growth' },
          ].map(({ icon, label }) => (
            <div key={icon} className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-xl">{icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* System Online pill — mobile only */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden">
        <div
          className="flex gap-4 items-center px-6 py-3 rounded-full border backdrop-blur-md"
          style={{ backgroundColor: 'rgba(34,42,61,0.4)', borderColor: 'rgba(62,72,80,0.1)' }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#89ceff' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#dae2fd' }}>
            System Online
          </span>
        </div>
      </div>
    </div>
  )
}
