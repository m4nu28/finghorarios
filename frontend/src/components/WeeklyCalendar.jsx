const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']
const HOUR_HEIGHT = 64

const COLORS = [
  { bg: 'bg-accent-50', border: 'border-accent-200', text: 'text-accent-700', dot: 'bg-accent-500' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', dot: 'bg-violet-500' },
]

const DARK_COLORS = [
  { bg: 'dark:bg-accent-950/40', border: 'dark:border-accent-800/60', text: 'dark:text-accent-300', dot: 'dark:bg-accent-400' },
  { bg: 'dark:bg-emerald-950/40', border: 'dark:border-emerald-800/60', text: 'dark:text-emerald-300', dot: 'dark:bg-emerald-400' },
  { bg: 'dark:bg-amber-950/40', border: 'dark:border-amber-800/60', text: 'dark:text-amber-300', dot: 'dark:bg-amber-400' },
  { bg: 'dark:bg-rose-950/40', border: 'dark:border-rose-800/60', text: 'dark:text-rose-300', dot: 'dark:bg-rose-400' },
  { bg: 'dark:bg-cyan-950/40', border: 'dark:border-cyan-800/60', text: 'dark:text-cyan-300', dot: 'dark:bg-cyan-400' },
  { bg: 'dark:bg-violet-950/40', border: 'dark:border-violet-800/60', text: 'dark:text-violet-300', dot: 'dark:bg-violet-400' },
]

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function getTopPx(timeStr, startHour) {
  return ((timeToMinutes(timeStr) - startHour * 60) / 60) * HOUR_HEIGHT
}

function getHeightPx(start, end) {
  return ((timeToMinutes(end) - timeToMinutes(start)) / 60) * HOUR_HEIGHT
}

function shortName(name) {
  if (!name) return ''
  return name.length > 22 ? name.slice(0, 20) + '…' : name
}

export default function WeeklyCalendar({ solution, busyBlocks, courseNameMap }) {
  const meetings = solution?.meetings || []
  const courseCodes = [...new Set(meetings.map(m => m.course_code))]
  const colorMap = {}
  courseCodes.forEach((code, i) => { colorMap[code] = { light: COLORS[i % COLORS.length], dark: DARK_COLORS[i % DARK_COLORS.length] } })

  const meetingsByDay = { 0: [], 1: [], 2: [], 3: [], 4: [] }
  meetings.forEach(m => { if (meetingsByDay[m.day]) meetingsByDay[m.day].push(m) })

  const blocksByDay = {}
  ;(busyBlocks || []).forEach(b => {
    if (!blocksByDay[b.day]) blocksByDay[b.day] = []
    blocksByDay[b.day].push(b)
  })

  let earliest = 23, latest = 0
  meetings.forEach(m => {
    const s = timeToMinutes(m.start) / 60, e = timeToMinutes(m.end) / 60
    if (s < earliest) earliest = s; if (e > latest) latest = e
  })
  ;(busyBlocks || []).forEach(b => {
    const s = timeToMinutes(b.start) / 60, e = timeToMinutes(b.end) / 60
    if (s < earliest) earliest = s; if (e > latest) latest = e
  })

  const START_HOUR = meetings.length || (busyBlocks && busyBlocks.length) ? Math.floor(earliest) : 7
  const END_HOUR = meetings.length || (busyBlocks && busyBlocks.length) ? Math.ceil(latest) + 1 : 22
  const TOTAL_HOURS = END_HOUR - START_HOUR
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => i + START_HOUR)

  return (
    <div className="card">
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-4">Calendario</label>

      <div className="overflow-x-auto -mx-6 px-6">
        <div className="min-w-[480px]">
          <div className="flex border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
            <div className="w-12 flex-shrink-0">
              <div className="h-10 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              {hours.map(h => (
                <div key={h} className="border-b border-neutral-100 dark:border-neutral-800/50 bg-white dark:bg-neutral-900" style={{ height: HOUR_HEIGHT }}>
                  <span className="block text-[10px] text-neutral-400 text-right pr-2 pt-1 font-medium">{h}:00</span>
                </div>
              ))}
            </div>

            {DAY_NAMES.map((dayName, dayIndex) => (
              <div key={dayIndex} className="flex-1 border-l border-neutral-200 dark:border-neutral-800 relative">
                <div className="h-10 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                  <span className="text-[11px] font-medium text-neutral-500">{dayName}</span>
                </div>
                <div className="relative" style={{ height: TOTAL_HOURS * HOUR_HEIGHT }}>
                  {hours.map(h => (
                    <div key={h} className="border-b border-neutral-100 dark:border-neutral-800/50 bg-white dark:bg-neutral-900" style={{ height: HOUR_HEIGHT }} />
                  ))}

                  {(blocksByDay[dayIndex] || []).map((block, i) => {
                    const top = getTopPx(block.start, START_HOUR)
                    const height = getHeightPx(block.start, block.end)
                    const isFixed = block.fixed
                    return (
                      <div
                        key={`block-${i}`}
                        className={`absolute left-1 right-1 rounded-xl flex items-center justify-center z-10 ${
                          isFixed
                            ? 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
                            : 'bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 border-dashed'
                        }`}
                        style={{ top, height }}
                      >
                        {block.reason && (
                          <span className={`text-[9px] font-medium leading-tight px-1 text-center ${isFixed ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-400 dark:text-neutral-500'}`}>
                            {block.reason}
                          </span>
                        )}
                      </div>
                    )
                  })}

                  {meetingsByDay[dayIndex].map((meeting, i) => {
                    const top = getTopPx(meeting.start, START_HOUR)
                    const height = getHeightPx(meeting.start, meeting.end)
                    const color = colorMap[meeting.course_code]?.light || COLORS[0]
                    const dColor = colorMap[meeting.course_code]?.dark || DARK_COLORS[0]
                    const name = courseNameMap?.[meeting.course_code] || meeting.course_name || meeting.course_code
                    return (
                      <div
                        key={`m-${i}`}
                        className={`absolute left-0.5 right-0.5 ${color.bg} ${dColor.bg} border ${color.border} ${dColor.border} rounded-xl px-2 py-1 overflow-hidden z-20 cursor-default hover:shadow-card-hover transition-shadow duration-150`}
                        style={{ top, height, minHeight: 24 }}
                      >
                        <div className={`text-[10px] font-semibold ${color.text} ${dColor.text} leading-tight truncate`}>
                          {shortName(name)}
                        </div>
                        {height > 36 && (
                          <div className="text-[9px] text-neutral-500 leading-tight mt-0.5">Grupo {meeting.group_number}</div>
                        )}
                        {height > 52 && (
                          <div className="text-[9px] text-neutral-400 leading-tight">{meeting.start} – {meeting.end}</div>
                        )}
                        {height > 68 && meeting.room && (
                          <div className="text-[9px] text-neutral-400 leading-tight truncate opacity-60">{meeting.room}</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {courseCodes.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {courseCodes.map(code => {
            const color = colorMap[code]?.light || COLORS[0]
            const dColor = colorMap[code]?.dark || DARK_COLORS[0]
            const name = courseNameMap?.[code] || meetings.find(x => x.course_code === code)?.course_name || code
            return (
              <div key={code} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color.dot} ${dColor.dot}`} />
                <span className="text-[11px] font-medium text-neutral-500">{code}</span>
                <span className="text-[10px] text-neutral-400 hidden sm:inline">{shortName(name)}</span>
              </div>
            )
          })}
        </div>
      )}

      {meetings.length === 0 && (
        <div className="text-center py-20">
          <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <p className="text-sm text-neutral-400">Seleccioná una opción para ver el calendario</p>
        </div>
      )}
    </div>
  )
}
