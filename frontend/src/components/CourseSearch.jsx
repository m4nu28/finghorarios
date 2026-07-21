import { useState, useCallback, useRef, useEffect } from 'react'
import { searchCourses } from '../api/client'

export default function CourseSearch({ onAddCourse, selectedCodes }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = useCallback(async (value) => {
    setQuery(value)
    if (value.length < 2) { setResults([]); setOpen(false); return }
    setSearching(true)
    try {
      const data = await searchCourses(value)
      setResults(data)
      setOpen(true)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  const handleSelect = useCallback((course) => {
    onAddCourse(course)
    setQuery('')
    setResults([])
    setOpen(false)
  }, [onAddCourse])

  return (
    <div className="card" ref={wrapRef}>
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">Buscar materias</label>
      <div className="relative">
        <div className="flex items-center">
          <svg className="w-4 h-4 text-neutral-400 flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Nombre o código..."
            className="input pl-2.5"
            onFocus={() => results.length > 0 && setOpen(true)}
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-neutral-200 dark:border-neutral-600 border-t-accent-500 rounded-full animate-spin" />
            </div>
          )}
        </div>
        {open && results.length > 0 && (
          <div className="absolute z-30 w-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-elevated max-h-72 overflow-y-auto animate-slide-down">
            {results.map((course) => (
              <button
                key={course.code}
                onClick={() => handleSelect(course)}
                disabled={selectedCodes.includes(course.code)}
                className="w-full px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-between transition-colors duration-100 border-b border-neutral-100 dark:border-neutral-800 last:border-0 disabled:opacity-30 disabled:cursor-not-allowed first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-mono font-semibold text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/30 px-2 py-0.5 rounded-lg flex-shrink-0">{course.code}</span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">{course.name}</span>
                </div>
                <span className="text-[11px] text-neutral-400 flex-shrink-0 ml-3">
                  {course.group_count} grupo{course.group_count !== 1 ? 's' : ''}
                </span>
              </button>
            ))}
          </div>
        )}
        {open && query.length >= 2 && results.length === 0 && !searching && (
          <div className="absolute z-30 w-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-elevated p-8 text-center animate-slide-down">
            <p className="text-sm text-neutral-400">No se encontraron materias</p>
          </div>
        )}
      </div>
    </div>
  )
}
