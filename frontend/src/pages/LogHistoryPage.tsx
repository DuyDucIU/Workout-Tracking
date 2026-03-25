import { useState } from 'react'
import { useLogs } from '@/hooks/useLogs'
import { LogHistoryItem } from '@/components/logs/LogHistoryItem'

export function LogHistoryPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(0)
  const size = 10

  const { data, isLoading } = useLogs({
    from: from || undefined,
    to: to || undefined,
    page,
    size,
  })

  return (
    <div className="px-8 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-black tracking-tight mb-8" style={{ color: '#dae2fd' }}>History</h1>

      {/* Date filter */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>From</p>
          <input
            type="date"
            value={from}
            onChange={e => { setFrom(e.target.value); setPage(0) }}
            className="rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
          />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#88929b' }}>To</p>
          <input
            type="date"
            value={to}
            onChange={e => { setTo(e.target.value); setPage(0) }}
            className="rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: '#060e20', color: '#dae2fd' }}
          />
        </div>
        {(from || to) && (
          <button
            onClick={() => { setFrom(''); setTo(''); setPage(0) }}
            className="text-xs mt-5"
            style={{ color: '#88929b' }}
          >
            Clear
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl" style={{ color: '#89ceff' }}>progress_activity</span>
        </div>
      )}

      {!isLoading && data && data.content.length === 0 && (
        <div className="py-16 text-center rounded-xl" style={{ backgroundColor: '#131b2e' }}>
          <span className="material-symbols-outlined text-5xl mb-3 block" style={{ color: '#3e4850' }}>history</span>
          <p className="text-sm" style={{ color: '#88929b' }}>No workout logs yet. Start by logging a workout!</p>
        </div>
      )}

      {data && data.content.length > 0 && (
        <div className="space-y-3">
          {data.content.map(log => (
            <LogHistoryItem key={log.id} log={log} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
            style={{ backgroundColor: '#222a3d', color: '#bec8d2' }}
          >
            Previous
          </button>
          <span className="text-sm" style={{ color: '#88929b' }}>
            Page {page + 1} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
            disabled={page >= data.totalPages - 1}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
            style={{ backgroundColor: '#222a3d', color: '#bec8d2' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
