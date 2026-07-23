const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const API_BASE = `${API_URL}/api`

async function request(url, options = {}) {
  const res = await fetch(url, options)
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    if (body?.error) {
      const err = new Error(body.error.message || 'Error del servidor.')
      err.code = body.error.code
      err.fields = body.error.fields
      throw err
    }
    if (body?.detail) throw new Error(body.detail)
    throw new Error('Error del servidor. Intentá de nuevo.')
  }
  return body?.data !== undefined ? body.data : body
}

export async function searchCourses(query) {
  const url = query
    ? `${API_BASE}/courses/?search=${encodeURIComponent(query)}`
    : `${API_BASE}/courses/`
  return request(url)
}

export async function checkApiConnection() {
  return request(`${API_BASE}/courses/?limit=1`)
}

export async function generateSchedule({ course_codes, busy_blocks, preferences, course_types }) {
  return request(`${API_BASE}/schedules/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ course_codes, busy_blocks, preferences, course_types }),
  })
}
