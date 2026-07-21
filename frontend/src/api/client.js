const API_BASE = '/api'

async function request(url, options = {}) {
  const res = await fetch(url, options)
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    if (body?.error) throw new Error(body.error)
    if (body?.detail) throw new Error(body.detail)
    if (typeof body === 'object') {
      const msgs = Object.entries(body)
        .flatMap(([k, v]) => (Array.isArray(v) ? v.map(e => `${k}: ${e}`) : [`${k}: ${v}`]))
      if (msgs.length) throw new Error(msgs.join('. '))
    }
    throw new Error('Error del servidor. Intentá de nuevo.')
  }
  return body
}

export async function searchCourses(query) {
  const url = query
    ? `${API_BASE}/courses/?search=${encodeURIComponent(query)}`
    : `${API_BASE}/courses/`
  return request(url)
}

export async function generateSchedule({ course_codes, busy_blocks, preferences, course_types }) {
  return request(`${API_BASE}/planner/generate/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ course_codes, busy_blocks, preferences, course_types }),
  })
}
