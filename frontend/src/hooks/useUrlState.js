import { useState, useCallback, useEffect } from 'react'

function getParam(key, fallback) {
  const params = new URLSearchParams(window.location.search)
  const val = params.get(key)
  return val !== null ? val : fallback
}

function setParam(key, value) {
  const url = new URL(window.location)
  if (value === null || value === undefined || value === '') {
    url.searchParams.delete(key)
  } else {
    url.searchParams.set(key, value)
  }
  window.history.replaceState({}, '', url)
}

export default function useUrlState(key, defaultValue) {
  const [state, setState] = useState(() => getParam(key, defaultValue))

  useEffect(() => {
    setParam(key, state)
  }, [key, state])

  useEffect(() => {
    function handlePop() {
      setState(getParam(key, defaultValue))
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [key, defaultValue])

  return [state, setState]
}
