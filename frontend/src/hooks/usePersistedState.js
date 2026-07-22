import { useState, useCallback } from 'react'

function getStored(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    if (v === null) return fallback
    return JSON.parse(v)
  } catch { return fallback }
}

function safeSetStored(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export default function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const stored = getStored(key, undefined)
    if (stored === undefined) return defaultValue
    if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)) {
      return { ...defaultValue, ...stored }
    }
    return stored
  })

  const setPersisted = useCallback((valueOrUpdater) => {
    setState(prev => {
      const next = typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater
      safeSetStored(key, next)
      return next
    })
  }, [key])

  return [state, setPersisted]
}
