import { useState, useEffect, useCallback } from 'react'
import { searchCourses, generateSchedule } from '../api/client'
import CourseSearch from '../components/CourseSearch'
import SelectedCourses from '../components/SelectedCourses'
import AvailabilityEditor from '../components/AvailabilityEditor'
import FixedCourses from '../components/FixedCourses'
import PreferencePanel from '../components/PreferencePanel'
import WeeklyCalendar from '../components/WeeklyCalendar'
import ScheduleResults from '../components/ScheduleResults'

function getStored(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    if (v === null) return fallback
    const parsed = JSON.parse(v)
    if (parsed === null || typeof parsed !== 'object') return fallback
    return parsed
  } catch { return fallback }
}

function safeSetStored(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

const DEFAULT_PREFS = { periods: [], avoid_friday: false, avoid_saturday: false, max_days: null }

function isValidFixedCourses(v) {
  return Array.isArray(v) && v.every(c => c.name && Array.isArray(c.blocks))
}

export default function HorariosModule({ loadError }) {
  const [courses, setCourses] = useState([])
  const [selectedCourses, setSelectedCourses] = useState(() => getStored('selectedCourses', []))
  const [busyBlocks, setBusyBlocks] = useState(() => {
    const v = getStored('busyBlocks', [])
    return Array.isArray(v) ? v : []
  })
  const [fixedCourses, setFixedCourses] = useState(() => {
    const v = getStored('fixedCourses', [])
    return isValidFixedCourses(v) ? v : []
  })
  const [preferences, setPreferences] = useState(() => {
    const v = getStored('preferences', DEFAULT_PREFS)
    return { ...DEFAULT_PREFS, ...v }
  })
  const [courseTypes, setCourseTypes] = useState(() => {
    const v = getStored('courseTypes', {})
    return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {}
  })
  const [results, setResults] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { safeSetStored('selectedCourses', selectedCourses) }, [selectedCourses])
  useEffect(() => { safeSetStored('busyBlocks', busyBlocks) }, [busyBlocks])
  useEffect(() => { safeSetStored('fixedCourses', fixedCourses) }, [fixedCourses])
  useEffect(() => { safeSetStored('preferences', preferences) }, [preferences])
  useEffect(() => { safeSetStored('courseTypes', courseTypes) }, [courseTypes])

  useEffect(() => {
    searchCourses('').then(setCourses).catch(() => {})
  }, [])

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
    if (selectedCourses.some(c => c.code === course.code)) return
    setSelectedCourses(prev => [...prev, course])
  }, [selectedCourses])

  const handleRemoveCourse = useCallback((code) => {
    setSelectedCourses(prev => prev.filter(c => c.code !== code))
  }, [])

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
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 px-5 py-3.5 text-sm text-red-700 dark:text-red-400">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <CourseSearch onAddCourse={handleAddCourse} selectedCodes={selectedCourses.map(c => c.code)} />
          <SelectedCourses
            courses={selectedCourses}
            onRemove={handleRemoveCourse}
            courseTypes={courseTypes}
            onChangeCourseType={setCourseTypes}
          />
          <FixedCourses fixedCourses={fixedCourses} onChange={setFixedCourses} />
          <AvailabilityEditor busyBlocks={busyBlocks} onChange={setBusyBlocks} />
          <PreferencePanel preferences={preferences} onChange={setPreferences} />

          <div className="flex gap-3">
            <button
              onClick={handleClearAll}
              className="btn-secondary py-3 text-sm px-4 flex-shrink-0"
            >
              Limpiar
            </button>
            <button
              onClick={handleGenerate}
              disabled={selectedCourses.length === 0 || loading}
              className={`btn-primary flex-1 py-3 text-sm ${
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

        <div className="lg:col-span-8 space-y-6">
          <ScheduleResults results={results} onSelect={setSelectedIdx} selectedIdx={selectedIdx} />
          <WeeklyCalendar
            solution={selectedIdx !== null ? results[selectedIdx] : null}
            busyBlocks={allBusyBlocks}
            courseNameMap={courseNameMap}
          />
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 px-5 py-3.5 text-sm text-red-700 dark:text-red-400 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
