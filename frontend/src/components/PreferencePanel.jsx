export default function PreferencePanel({ preferences, onChange }) {
  const update = (key, value) => onChange({ ...preferences, [key]: value })

  const togglePeriod = (p) => {
    const current = preferences.periods || []
    const next = current.includes(p) ? current.filter(x => x !== p) : [...current, p]
    update('periods', next)
  }

  return (
    <div className="card">
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-4">Preferencias</label>

      <div className="mb-5">
        <label className="block text-[11px] font-medium text-neutral-400 mb-2">Horarios preferidos</label>
        <div className="flex flex-wrap gap-1">
          {[
            { value: 'morning', label: 'Mañana' },
            { value: 'afternoon', label: 'Tarde' },
            { value: 'night', label: 'Noche' },
          ].map(opt => (
            <button key={opt.value} onClick={() => togglePeriod(opt.value)} className={`pill ${(preferences.periods || []).includes(opt.value) ? 'pill-active' : ''}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-[11px] font-medium text-neutral-400 mb-2">Horarios a evitar</label>
        <div className="flex flex-wrap gap-1">
          <button onClick={() => update('avoid_friday', !preferences.avoid_friday)} className={`pill ${preferences.avoid_friday ? 'pill-active' : ''}`}>
            Viernes
          </button>
          <button onClick={() => update('avoid_saturday', !preferences.avoid_saturday)} className={`pill ${preferences.avoid_saturday ? 'pill-active' : ''}`}>
            Sábado
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-neutral-400 mb-2">Máximo de días</label>
        <div className="flex gap-1">
          {[3, 4, 5].map(n => (
            <button key={n} onClick={() => update('max_days', preferences.max_days === n ? null : n)} className={`pill flex-1 text-center ${preferences.max_days === n ? 'pill-active' : ''}`}>
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
