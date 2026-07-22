const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']

function getScoreLabel(score) {
  if (score >= 95) return { text: 'Excelente', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' }
  if (score >= 85) return { text: 'Muy bueno', color: 'bg-accent-50 text-accent-700 dark:bg-accent-950/30 dark:text-accent-400' }
  if (score >= 75) return { text: 'Bueno', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' }
  return { text: 'Regular', color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' }
}

export default function ScheduleCard({ result, index, onSelect, isSelected }) {
  const label = getScoreLabel(result.score)
  const dayCount = result.days || 0
  const gapMinutes = result.gap_minutes || 0
  const gapHours = Math.floor(gapMinutes / 60)
  const gapMins = gapMinutes % 60
  const gapStr = gapHours > 0
    ? (gapMins > 0 ? `${gapHours}h ${gapMins}m` : `${gapHours}h`)
    : `${gapMins}m`

  const dayCounts = Array.isArray(result.gap_detail)
    ? result.gap_detail
        .filter(g => g.minutes > 0)
        .map(g => ({ day: DAY_NAMES[g.day] || g.day_name || g.day, minutes: g.minutes }))
    : []

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3.5 rounded-xl border transition-colors duration-100 ${
        isSelected
          ? 'bg-accent-50/50 dark:bg-accent-950/10 border-accent-200 dark:border-accent-800/60'
          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-neutral-300 dark:text-neutral-600">#{index + 1}</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${label.color}`}>{label.text}</span>
        </div>
        <span className="text-sm font-bold text-neutral-900 dark:text-white">{result.score}</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500 mb-2">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          {dayCount} día{dayCount !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {gapStr} libre{gapMinutes !== 1 ? 's' : ''}
        </span>
      </div>

      {dayCounts.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {dayCounts.map(({ day, minutes }) => (
            <span key={day} className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-md px-2 py-0.5">
              {day} {minutes}m
            </span>
          ))}
          <span className="text-[10px] font-semibold text-neutral-400 px-2 py-0.5">
            = {gapStr} total
          </span>
        </div>
      )}
    </button>
  )
}
