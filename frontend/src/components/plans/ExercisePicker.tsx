import { useState, useEffect, useRef } from 'react'
import type { ExerciseCategory, ExerciseDto, MuscleGroup } from '@/types/exercise'
import { useExercises } from '@/hooks/useExercises'

interface ExercisePickerProps {
  onSelect: (exercise: ExerciseDto) => void
  selectedId?: number
  placeholder?: string
}

const CATEGORIES: Array<{ label: string; value: ExerciseCategory | undefined }> = [
  { label: 'ALL', value: undefined },
  { label: 'STRENGTH', value: 'STRENGTH' },
  { label: 'CARDIO', value: 'CARDIO' },
  { label: 'FLEXIBILITY', value: 'FLEXIBILITY' },
]

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function ExercisePicker({ onSelect, selectedId, placeholder }: ExercisePickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ExerciseCategory | undefined>(undefined)
  const [muscleGroup] = useState<MuscleGroup | undefined>(undefined)
  const debouncedSearch = useDebounce(search, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useExercises({
    category,
    muscleGroup,
    search: debouncedSearch || undefined,
    size: 50,
  })

  const exercises = data?.content ?? []
  const selectedExercise = exercises.find(e => e.id === selectedId)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  function handleSelect(exercise: ExerciseDto) {
    onSelect(exercise)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="bg-[#060e20] text-[#dae2fd] rounded-xl px-4 py-3 w-full text-left text-sm flex items-center justify-between"
      >
        <span>{selectedExercise ? selectedExercise.name : (placeholder ?? 'Pick an exercise...')}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 ml-2">
          <path d="M4 6l4 4 4-4" stroke="#88929b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 w-full bg-[#131b2e] border border-[#3e4850] rounded-xl shadow-2xl mt-1 overflow-hidden">
          <input
            autoFocus
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full bg-[#060e20] text-[#dae2fd] px-4 py-3 text-sm outline-none placeholder:text-[#88929b] border-b border-[#3e4850]"
          />

          <div className="flex gap-2 px-4 py-2 border-b border-[#3e4850] overflow-x-auto">
            {CATEGORIES.map(({ label, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => setCategory(value)}
                className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                  category === value
                    ? 'bg-[#0ea5e9] text-[#00344d]'
                    : 'bg-[#222a3d] text-[#bec8d2]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <p className="text-[#bec8d2] text-sm text-center py-4">Loading...</p>
            ) : exercises.length === 0 ? (
              <p className="text-[#88929b] text-sm text-center py-4">No exercises found</p>
            ) : (
              exercises.map(exercise => (
                <div
                  key={exercise.id}
                  onClick={() => handleSelect(exercise)}
                  className="px-4 py-3 cursor-pointer hover:bg-[#222a3d] flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#dae2fd]">{exercise.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#bec8d2]">{exercise.muscleGroup}</p>
                  </div>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#234b64] text-[#94bad7] shrink-0">
                    {exercise.category}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
