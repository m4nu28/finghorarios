const TYPE_OPTIONS = [
  { value: 'both', label: 'T+P' },
  { value: 'teorico', label: 'T' },
  { value: 'practico', label: 'P' },
]

export default function SelectedCourses({ courses, onRemove, courseTypes, onChangeCourseType }) {
  if (courses.length === 0) {
    return (
      <div className="card border-dashed border-neutral-200 dark:border-neutral-700 bg-transparent p-8">
        <div className="flex items-center gap-2 text-neutral-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <p className="text-sm">Agregá materias con el buscador</p>
        </div>
      </div>
    )
  }

  const handleTypeChange = (code, type) => {
    onChangeCourseType((prev) => ({ ...prev, [code]: type }))
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Seleccionadas</label>
        <span className="text-[11px] font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-lg">{courses.length}</span>
      </div>
      <div className="space-y-1">
        {courses.map((course) => {
          const types = course.group_types || []
          const hasBoth = types.includes('teorico') && types.includes('practico')
          const type = courseTypes?.[course.code] || 'both'

          const typeLabel = {
            teorico: 'Teórico',
            practico: 'Práctico',
            colaborativo: 'Colaborativo',
            other: 'Grupo',
          }

          return (
            <div
              key={course.code}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 transition-colors group"
            >
              <span className="text-[11px] font-mono font-bold text-accent-700 dark:text-accent-400 bg-accent-100 dark:bg-accent-950/50 px-2.5 py-1 rounded-lg flex-shrink-0 tracking-wide">{course.code}</span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate flex-1 min-w-0 hidden sm:inline">{course.name}</span>
              {hasBoth ? (
                <div className="flex gap-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5 flex-shrink-0">
                  {TYPE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleTypeChange(course.code, opt.value)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all duration-150 ${
                        type === opt.value
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-lg flex-shrink-0">
                  {types.length === 1 ? typeLabel[types[0]] || types[0] : 'Grupo'}
                </span>
              )}
              <button
                onClick={() => onRemove(course.code)}
                className="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-red-500 transition-all rounded-lg p-0.5 flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
