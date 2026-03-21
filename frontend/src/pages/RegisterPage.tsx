import { RegisterForm } from '@/components/auth/RegisterForm'

export function RegisterPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: '#0b1326', color: '#dae2fd' }}
    >
      {/* Background blobs */}
      <div
        className="pointer-events-none fixed bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-[140px]"
        style={{ background: 'rgba(14,165,233,0.08)' }}
      />
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px]"
        style={{ background: 'rgba(137,206,255,0.05)' }}
      />

      {/* Two-column grid */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 px-8">

        {/* ── Right column on mobile (form first), left on lg+ ── */}
        {/* Mobile: order-1 renders first; lg: col-span-5, order-2 */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex items-center justify-center px-6 py-12 lg:py-16">
          <div className="w-full max-w-[480px]">
            {/* Card */}
            <div
              className="relative rounded-xl p-8 md:p-10 overflow-hidden"
              style={{ backgroundColor: '#131b2e' }}
            >
              {/* Tonal glow blob top-right inside card */}
              <div
                className="pointer-events-none absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full blur-[80px]"
                style={{ background: 'rgba(14,165,233,0.12)' }}
              />

              {/* Card header */}
              <div className="relative mb-8">
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#dae2fd' }}>
                  Create Account
                </h2>
                <p className="text-sm mt-1" style={{ color: '#bec8d2' }}>
                  Start your editorial fitness journey today.
                </p>
              </div>

              {/* Form (no card wrapper — card lives here) */}
              <div className="relative">
                <RegisterForm />
              </div>
            </div>
          </div>
        </div>

        {/* ── Branding column — mobile: order-2 (below form); lg: order-1, col-span-7 ── */}
        <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-20">
          {/* Label */}
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: '#89ceff' }}
          >
            Join the Elite
          </p>

          {/* Headline */}
          <h1
            className="font-black tracking-tighter text-5xl md:text-6xl lg:text-7xl leading-none mb-6"
            style={{ color: '#0ea5e9' }}
          >
            YOUR PROGRESS
            <br />
            CURATED.
          </h1>

          {/* Subtitle */}
          <p className="text-base max-w-md mb-12 leading-relaxed" style={{ color: '#bec8d2' }}>
            Log every rep, track every milestone, and watch your data tell the story of your
            transformation. Built for athletes who demand clarity.
          </p>

          {/* Bento stat cards */}
          <div className="flex flex-col sm:flex-row gap-6 max-w-lg">
            {/* Card 1 — Volume Growth */}
            <div
              className="flex-1 rounded-xl p-6"
              style={{ backgroundColor: '#222a3d' }}
            >
              <span
                className="material-symbols-outlined text-3xl mb-3 block"
                style={{ color: '#89ceff' }}
              >
                insights
              </span>
              <p
                className="text-3xl font-black tracking-tighter mb-1"
                style={{ color: '#dae2fd' }}
              >
                12%
              </p>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#bec8d2' }}
              >
                Volume Growth
              </p>
            </div>

            {/* Card 2 — Current Streak (offset down) */}
            <div
              className="flex-1 rounded-xl p-6 sm:translate-y-8"
              style={{ backgroundColor: '#222a3d' }}
            >
              <span
                className="material-symbols-outlined text-3xl mb-3 block"
                style={{ color: '#ffb86e' }}
              >
                bolt
              </span>
              <p
                className="text-3xl font-black tracking-tighter mb-1"
                style={{ color: '#dae2fd' }}
              >
                14 Day
              </p>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#bec8d2' }}
              >
                Current Streak
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
