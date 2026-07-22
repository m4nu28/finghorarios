import { useState } from 'react'

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

export default function AvailabilityEditor({ busyBlocks, onChange }) {
  const [mode, setMode] = useState('single')
  const [day, setDay] = useState(0)
  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('10:00')
  const [reason, setReason] = useState('')
  const [rangeDays, setRangeDays] = useState([0, 1, 2, 3, 4])

  const handleAddSingle = () => {
    if (!start || !end || start >= end) return
    onChange([...busyBlocks, { day, start, end, reason: reason.trim() || null }])
    setReason('')
  }

  const handleAddRange = () => {
    if (!start || !end || start >= end) return
    const newBlocks = rangeDays.map(d => ({ day: d, start, end, reason: reason.trim() || null }))
    const toAdd = newBlocks.filter(nb =>
      !busyBlocks.some(b => b.day === nb.day && b.start === nb.start && b.end === nb.end)
    )
    if (toAdd.length > 0) onChange([...busyBlocks, ...toAdd])
    setReason('')
  }

  return (
    <div>
      <span className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Horarios ocupados</span>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-3">Horarios en los que no podés cursar</p>

      <div className="flex gap-1 mb-3 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg">
        {[
          { key: 'single', label: 'Día individual' },
          { key: 'range', label: 'Rango de días' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setMode(opt.key)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors duration-100 ${
              mode === opt.key
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {mode === 'range' && (
        <div className="mb-2.5">
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Días</label>
          <div className="flex gap-1">
            {[
              { label: 'Lun–Vie', days: [0,1,2,3,4] },
              { label: 'Lun–Jue', days: [0,1,2,3] },
              { label: 'Mar–Vie', days: [1,2,3,4] },
            ].map((qr) => (
              <button key={qr.label} onClick={() => setRangeDays(qr.days)} className={`pill text-[11px] px-2.5 py-1 ${JSON.stringify(rangeDays) === JSON.stringify(qr.days) ? 'pill-active' : ''}`}>
                {qr.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'single' && (
        <div className="mb-2.5">
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Día</label>
          <div className="flex gap-1">
            {DAY_NAMES.map((name, i) => (
              <button key={i} onClick={() => setDay(i)} className={`pill flex-1 text-center py-1.5 ${day === i ? 'pill-active' : ''}`}>
                {name.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-2 mb-3">
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Desde</label>
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="input w-28 text-xs" />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Hasta</label>
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="input w-28 text-xs" />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Motivo</label>
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Opcional" className="input text-xs" />
        </div>
        <button onClick={mode === 'single' ? handleAddSingle : handleAddRange} className="btn-secondary text-xs px-4 py-2.5 flex-shrink-0">
          Agregar
        </button>
      </div>

      {busyBlocks.length > 0 && (
        <div className="space-y-0.5">
          {busyBlocks.map((block, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2 group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{DAY_NAMES[block.day] || `Día ${block.day}`}</span>
                  <span className="text-neutral-300 dark:text-neutral-600 mx-1.5">·</span>
                  <span className="text-sm text-neutral-500">{block.start} – {block.end}</span>
                  {block.reason && (
                    <>
                      <span className="text-neutral-300 dark:text-neutral-600 mx-1.5">·</span>
                      <span className="text-xs text-neutral-400">{block.reason}</span>
                    </>
                  )}
                </div>
              </div>
              <button onClick={() => onChange(busyBlocks.filter((_, idx) => idx !== i))} aria-label="Quitar bloque" className="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-red-500 transition-all ml-2 flex-shrink-0 p-1 min-h-[28px] min-w-[28px] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
