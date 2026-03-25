import { useState } from 'react'
import { WeightDisplay } from '@/components/shared/WeightDisplay'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useLog, useDeleteLog } from '@/hooks/useLogs'
import type { WorkoutLogSummaryDto } from '@/types/log'

interface LogHistoryItemProps {
  log: WorkoutLogSummaryDto
}

export function LogHistoryItem({ log }: LogHistoryItemProps) {
  const [expanded, setExpanded] = useState(false)
  const { data: detail, isLoading } = useLog(expanded ? log.id : undefined)
  const deleteLog = useDeleteLog()

  const formattedDate = new Date(log.completedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

  return (
    <div className="rounded-xl" style={{ backgroundColor: '#222a3d' }}>
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-lg transition-transform"
            style={{ color: '#89ceff', transform: expanded ? 'rotate(90deg)' : 'none' }}
          >
            chevron_right
          </span>
          <div>
            <p className="font-semibold" style={{ color: '#dae2fd' }}>{log.sessionNameSnap}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs" style={{ color: '#88929b' }}>{formattedDate}</span>
              {log.planNameSnap && (
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(137,206,255,0.12)', color: '#89ceff' }}
                >
                  {log.planNameSnap}
                </span>
              )}
              <span className="text-xs" style={{ color: '#88929b' }}>
                {log.entryCount} exercise{log.entryCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <ConfirmDialog
          title="Delete Log"
          description="Delete this workout log? This cannot be undone."
          onConfirm={() => deleteLog.mutate(log.id)}
        >
          <button
            className="p-1.5 rounded-lg hover:bg-red-900/30 transition-colors cursor-pointer"
            style={{ color: '#ffb4ab' }}
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </ConfirmDialog>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-2 pt-3" style={{ borderTop: '1px solid #3e4850' }}>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <span className="material-symbols-outlined animate-spin text-xl" style={{ color: '#89ceff' }}>progress_activity</span>
            </div>
          ) : detail ? (
            <>
              {detail.entries.map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg"
                  style={{ backgroundColor: '#131b2e' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#dae2fd' }}>{entry.exerciseNameSnap}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs" style={{ color: '#bec8d2' }}>
                        {entry.actualSets} × {entry.actualReps}
                      </span>
                      {entry.actualWeightKg != null && (
                        <span className="text-xs" style={{ color: '#89ceff' }}>
                          <WeightDisplay value={entry.actualWeightKg} />
                        </span>
                      )}
                      {entry.notes && (
                        <span className="text-xs truncate" style={{ color: '#88929b' }}>{entry.notes}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {detail.notes && (
                <p className="text-xs px-4 pt-2" style={{ color: '#88929b' }}>
                  <span className="font-semibold">Notes:</span> {detail.notes}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-center py-4" style={{ color: '#88929b' }}>Failed to load details.</p>
          )}
        </div>
      )}
    </div>
  )
}
