import { useState, useEffect, useCallback } from 'react'
import { searchCourses, generateSchedule } from '../api/client'
import usePersistedState from '../hooks/usePersistedState'
import CourseSearch from '../components/CourseSearch'
import SelectedCourses from '../components/SelectedCourses'
import AvailabilityEditor from '../components/AvailabilityEditor'
import FixedCourses from '../components/FixedCourses'
import PreferencePanel from '../components/PreferencePanel'
import WeeklyCalendar from '../components/WeeklyCalendar'
import ScheduleResults from '../components/ScheduleResults'

const DEFAULT_PREFS = { periods: [], avoid_friday: false, avoid_saturday: false, max_days: null }

function isValidFixedCourses(v) {
  return Array.isArray(v) && v.every(c => c.name && Array.isArray(c.blocks))
}

export default function HorariosModule({ loadError }) {
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [coursesError, setCoursesError] = useState(null)
  const [selectedCourses, setSelectedCourses] = usePersistedState('selectedCourses', [])
  const [busyBlocks, setBusyBlocks] = usePersistedState('busyBlocks', [])
  const [fixedCourses, setFixedCourses] = usePersistedState('fixedCourses', [])
  const [preferences, setPreferences] = usePersistedState('preferences', DEFAULT_PREFS)
  const [courseTypes, setCourseTypes] = usePersistedState('courseTypes', {})
  const [results, setResults] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchCourses = useCallback(() => {
    setCoursesLoading(true)
    setCoursesError(null)
    searchCourses('')
      .then(setCourses)
      .catch(() => setCoursesError('No se pudieron cargar las materias.'))
      .finally(() => setCoursesLoading(false))
  }, [])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  useEffect(() => {
    setResults([])
    setSelectedIdx(null)
  }, [selectedCourses, busyBlocks, fixedCourses, preferences, courseTypes])

  const courseNameMap = {}
  courses.forEach(c => { courseNameMap[c.code] = c.name })

  const allBusyBlocks = [
    ...busyBlocks,
    ...fixedCourses.flatMap(fc =>
      (fc.blocks || []).map(b => ({ ...b, fixed: true, reason: fc.name }))
    ),
  ]

  const handleAddCourse = useCallback((course) => {
    setSelectedCourses(prev => {
      if (prev.some(c => c.code === course.code)) return prev
      return [...prev, course]
    })
  }, [setSelectedCourses])

  const handleRemoveCourse = useCallback((code) => {
    setSelectedCourses(prev => prev.filter(c => c.code !== code))
  }, [setSelectedCourses])

  const handleGenerate = useCallback(async () => {
    if (selectedCourses.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const prefs = {
        preferred_periods: preferences.periods || [],
        avoid_friday: preferences.avoid_friday,
        avoid_saturday: preferences.avoid_saturday,
      }
      if (preferences.max_days != null) prefs.max_days = preferences.max_days

      const data = await generateSchedule({
        course_codes: selectedCourses.map(c => c.code),
        busy_blocks: allBusyBlocks,
        preferences: prefs,
        course_types: courseTypes,
      })
      const sols = data.solutions || []
      setResults(sols)
      if (sols.length > 0) setSelectedIdx(0)
      else setError('No se encontraron horarios posibles con las combinaciones seleccionadas.')
    } catch (err) {
      setError(err.message || 'Error al generar horarios. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [selectedCourses, allBusyBlocks, preferences, courseTypes])

  const handleClearAll = () => {
    setSelectedCourses([])
    setBusyBlocks([])
    setFixedCourses([])
    setPreferences({ ...DEFAULT_PREFS })
    setCourseTypes({})
    setResults([])
    setSelectedIdx(null)
    setError(null)
  }

  return (
    <>
      {loadError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between">
          <span>{loadError}</span>
          <button onClick={() => window.location.reload()} className="text-xs font-medium underline hover:no-underline">Reintentar</button>
        </div>
      )}

      {coursesError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between">
          <span>{coursesError}</span>
          <button onClick={fetchCourses} className="text-xs font-medium underline hover:no-underline">Reintentar</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-full btn-secondary py-2.5 text-sm mb-3 flex items-center justify-between"
          >
            <span>Filtros</span>
            <svg className={`w-4 h-4 transition-transform duration-150 ${sidebarOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block space-y-4`}>
            <CourseSearch onAddCourse={handleAddCourse} selectedCodes={selectedCourses.map(c => c.code)} />

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <SelectedCourses
                courses={selectedCourses}
                onRemove={handleRemoveCourse}
                courseTypes={courseTypes}
                onChangeCourseType={setCourseTypes}
              />
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <FixedCourses fixedCourses={fixedCourses} onChange={setFixedCourses} />
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <AvailabilityEditor busyBlocks={busyBlocks} onChange={setBusyBlocks} />
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
              <PreferencePanel preferences={preferences} onChange={setPreferences} />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleClearAll}
                className="btn-secondary py-2.5 text-sm px-4 flex-shrink-0"
              >
                Limpiar
              </button>
              <button
                onClick={handleGenerate}
                disabled={selectedCourses.length === 0 || loading}
                className={`btn-primary flex-1 py-2.5 text-sm ${
                  selectedCourses.length === 0 || loading ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generando...
                  </span>
                ) : 'Generar horarios'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
          <ScheduleResults results={results} onSelect={setSelectedIdx} selectedIdx={selectedIdx} />
          <WeeklyCalendar
            solution={selectedIdx !== null ? results[selectedIdx] : null}
            busyBlocks={allBusyBlocks}
            courseNameMap={courseNameMap}
          />
        </div>
      </div>
    </>
  )
}
