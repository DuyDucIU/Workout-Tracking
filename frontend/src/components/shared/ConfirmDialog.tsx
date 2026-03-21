import { useRef } from 'react'

interface ConfirmDialogProps {
  title: string
  description: string
  onConfirm: () => void
  children: React.ReactNode
}

export function ConfirmDialog({ title, description, onConfirm, children }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <span onClick={(e) => { e.stopPropagation(); dialogRef.current?.showModal() }}>
        {children}
      </span>
      <dialog
        ref={dialogRef}
        className="rounded-xl p-0 border backdrop:bg-black/60"
        style={{
          backgroundColor: '#131b2e',
          borderColor: '#3e4850',
          color: '#dae2fd',
          minWidth: '360px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: 0,
        }}
        onClick={(e) => { e.stopPropagation(); if (e.target === dialogRef.current) dialogRef.current?.close() }}
      >
        <div className="p-6">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#dae2fd' }}>{title}</h3>
          <p className="text-sm mb-6" style={{ color: '#bec8d2' }}>{description}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => dialogRef.current?.close()}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#222a3d', color: '#bec8d2', border: '1px solid #3e4850' }}
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); dialogRef.current?.close() }}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#7f1d1d', color: '#ffdad6' }}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
