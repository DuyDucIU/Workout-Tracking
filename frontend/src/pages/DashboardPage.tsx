import { Link } from 'react-router-dom'

const stats = [
  { label: 'Total Workouts', value: '124', badge: '+5%', badgeColor: '#89ceff' },
  { label: 'Total Volume (KG)', value: '45.2k', badge: '+12%', badgeColor: '#89ceff' },
  { label: 'Current Streak', value: '12', badge: 'Days', badgeColor: '#ffb86e' },
]

const chartBars = [
  { day: 'Mon', height: 'h-32', fill: 20 },
  { day: 'Tue', height: 'h-48', fill: 40 },
  { day: 'Wed', height: 'h-64', fill: 100, primary: true },
  { day: 'Thu', height: 'h-40', fill: 30 },
  { day: 'Fri', height: 'h-24', fill: 10 },
  { day: 'Sat', height: 'h-12', fill: 0 },
  { day: 'Sun', height: 'h-56', fill: 50 },
]

const scheduleItems = [
  {
    icon: 'weight',
    iconColor: '#89ceff',
    title: 'Push Day (A)',
    badge: 'STRENGTH',
    badgeBg: '#234b64',
    badgeText: '#94bad7',
    duration: '45 mins',
    chevronHover: '#89ceff',
    dashed: false,
  },
  {
    icon: 'directions_run',
    iconColor: '#ffb86e',
    title: 'Zone 2 Cardio',
    badge: 'ENDURANCE',
    badgeBg: '#234b64',
    badgeText: '#94bad7',
    duration: '30 mins',
    chevronHover: '#ffb86e',
    dashed: false,
  },
]

export function DashboardPage() {
  return (
    <div className="px-16 py-12 flex flex-col gap-12">
      {/* Section 1 — Hero */}
      <div className="flex items-start justify-between gap-8 flex-wrap">
        <div className="flex flex-col gap-3">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#89ceff' }}
          >
            Monday, October 24
          </p>
          <h1
            className="text-5xl font-black tracking-tighter leading-none"
            style={{ color: '#dae2fd' }}
          >
            The Kinetic Editorial.
          </h1>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="text-sm max-w-xs text-right" style={{ color: '#bec8d2' }}>
            Track your performance, analyze your progress, and hit your goals with precision.
          </p>
          <Link
            to="/log"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform"
            style={{
              background: 'linear-gradient(to right, #89ceff, #0ea5e9)',
              color: '#00344d',
            }}
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Quick Log Workout
          </Link>
        </div>
      </div>

      {/* Section 2 — Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-8 rounded-[2rem] flex flex-col justify-between min-h-[180px]"
            style={{ backgroundColor: '#222a3d' }}
          >
            <p className="text-sm font-medium" style={{ color: '#bec8d2' }}>
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <p
                className="text-6xl font-black tracking-tighter"
                style={{ color: '#dae2fd' }}
              >
                {stat.value}
              </p>
              <p className="text-sm font-bold pb-2" style={{ color: stat.badgeColor }}>
                {stat.badge}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Section 3 — Activity + Schedule */}
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Activity Flow */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="font-bold" style={{ color: '#dae2fd' }}>
              Activity Flow
            </p>
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full inline-block"
                style={{ backgroundColor: '#89ceff' }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: '#bec8d2' }}
              >
                Frequency
              </span>
            </div>
          </div>
          <div
            className="p-10 rounded-[2.5rem] flex items-end justify-between h-[300px] gap-4"
            style={{ backgroundColor: '#131b2e' }}
          >
            {chartBars.map((bar) => (
              <div key={bar.day} className="flex flex-col items-center gap-4 flex-1">
                <div className={`w-full ${bar.height} rounded-t-full relative overflow-hidden`} style={{ backgroundColor: '#222a3d' }}>
                  {bar.primary ? (
                    <div className="absolute inset-0 rounded-t-full" style={{ backgroundColor: '#89ceff' }} />
                  ) : bar.fill > 0 ? (
                    <div
                      className="absolute inset-0 rounded-t-full"
                      style={{ backgroundColor: `rgba(137,206,255,${bar.fill / 100})` }}
                    />
                  ) : null}
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-tighter"
                  style={{ color: bar.primary ? '#dae2fd' : '#bec8d2' }}
                >
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="font-bold" style={{ color: '#dae2fd' }}>
              Today's Schedule
            </p>
            <Link
              to="/log"
              className="text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
              style={{ color: '#89ceff' }}
            >
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {scheduleItems.map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
                style={{ backgroundColor: '#222a3d' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.backgroundColor = '#31394d'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.backgroundColor = '#222a3d'
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="size-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#060e20' }}
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ color: item.iconColor }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold" style={{ color: '#dae2fd' }}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ backgroundColor: item.badgeBg, color: item.badgeText }}
                      >
                        {item.badge}
                      </span>
                      <span className="text-xs" style={{ color: '#bec8d2' }}>
                        • {item.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className="material-symbols-outlined text-xl transition-colors"
                  style={{ color: '#bec8d2' }}
                >
                  chevron_right
                </span>
              </div>
            ))}

            {/* Tomorrow: Recovery — dashed */}
            <div
              className="p-6 rounded-2xl flex items-center gap-4 opacity-60"
              style={{ border: '1px dashed #3e4850' }}
            >
              <div
                className="size-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#131b2e' }}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ color: '#88929b' }}
                >
                  bed
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold" style={{ color: '#dae2fd' }}>
                  Tomorrow: Recovery
                </p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: '#bec8d2' }}>
                  Active Rest Flow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
