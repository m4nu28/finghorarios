import { useState, useMemo } from 'react'
import ScheduleCard from './ScheduleCard'

const SORT_OPTIONS = [
  { key: 'score', label: 'Mejor puntuación' },
  { key: 'days', label: 'Menos días' },
  { key: 'gap', label: 'Menos huecos' },
]

export default function ScheduleResults({ results, onSelect, selectedIdx }) {
  const [sortBy, setSortBy] = useState('score')
  const [showAll, setShowAll] = useState(false)

  const sorted = useMemo(() => {
    const arr = [...(results || [])]
    if (sortBy === 'score') arr.sort((a, b) => (b.score || 0) - (a.score || 0))
    else if (sortBy === 'days') arr.sort((a, b) => (a.days || 0) - (b.days || 0))
    else if (sortBy === 'gap') arr.sort((a, b) => (a.gap_minutes || 0) - (b.gap_minutes || 0))
    return arr
  }, [results, sortBy])

  const visible = showAll ? sorted : sorted.slice(0, 8)

  if (!results || results.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Horarios generados</label>
        <span className="text-[11px] font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-lg">
          {results.length} {results.length === 1 ? 'opción' : 'opciones'}
        </span>
      </div>

      <div className="flex gap-1 mb-5 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-xl">
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all duration-150 ${
              sortBy === opt.key
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((result, i) => (
          <ScheduleCard
            key={i}
            result={result}
            index={results.indexOf(result)}
            onSelect={() => onSelect(results.indexOf(result))}
            isSelected={selectedIdx === results.indexOf(result)}
          />
        ))}
      </div>

      {sorted.length > 8 && !showAll && (
        <button onClick={() => setShowAll(true)} className="btn-ghost w-full mt-4 text-xs">
          Ver {sorted.length - 8} opciones más
        </button>
      )}
    </div>
  )
}
