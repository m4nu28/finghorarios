import { useState } from 'react'

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

export default function FixedCourses({ fixedCourses, onChange }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedDays, setSelectedDays] = useState([0])
  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('10:00')
  const [draftBlocks, setDraftBlocks] = useState([])
  const [editingIdx, setEditingIdx] = useState(null)

  const toggleDay = (d) => {
    setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  const handleAddBlock = () => {
    if (!start || !end || start >= end || selectedDays.length === 0) return
    const newBlocks = selectedDays.map(d => ({ day: d, start, end }))
    const toAdd = newBlocks.filter(nb =>
      !draftBlocks.some(b => b.day === nb.day && b.start === nb.start && b.end === nb.end)
    )
    if (toAdd.length > 0) setDraftBlocks([...draftBlocks, ...toAdd])
  }

  const handleRemoveDraft = (i) => setDraftBlocks(draftBlocks.filter((_, idx) => idx !== i))

  const handleSaveCourse = () => {
    if (!name.trim() || draftBlocks.length === 0) return
    if (editingIdx !== null) {
      const next = [...fixedCourses]
      next[editingIdx] = { name: name.trim(), blocks: [...draftBlocks] }
      onChange(next)
      setEditingIdx(null)
    } else {
      onChange([...fixedCourses, { name: name.trim(), blocks: [...draftBlocks] }])
    }
    setName('')
    setDraftBlocks([])
  }

  const handleEdit = (i) => {
    const course = fixedCourses[i]
    setName(course.name)
    setDraftBlocks([...course.blocks])
    setEditingIdx(i)
  }

  const handleRemoveCourse = (i) => {
    onChange(fixedCourses.filter((_, idx) => idx !== i))
    if (editingIdx === i) { setName(''); setDraftBlocks([]); setEditingIdx(null) }
  }

  const canSave = name.trim() && draftBlocks.length > 0

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 text-left">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex-1">Horarios fijos</span>
        {fixedCourses.length > 0 && !open && (
          <span className="text-[11px] text-neutral-400 font-medium mr-1">{fixedCourses.length}</span>
        )}
        <svg className={`w-4 h-4 text-neutral-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="mt-3">
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-3">Materias con horario asignado que el planificador debe respetar.</p>

          {fixedCourses.length > 0 && (
            <div className="space-y-1 mb-3">
              {fixedCourses.map((course, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-3 py-2 transition-colors group ${
                    editingIdx === i
                      ? 'bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800'
                      : 'bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{course.name}</span>
                      <span className="text-[10px] text-neutral-400">{course.blocks.length} bloque{course.blocks.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(i)} aria-label={`Editar ${course.name}`} className="text-neutral-300 hover:text-accent-600 transition-colors p-1 min-h-[28px] min-w-[28px] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button onClick={() => handleRemoveCourse(i)} aria-label={`Quitar ${course.name}`} className="text-neutral-300 hover:text-red-500 transition-colors p-1 min-h-[28px] min-w-[28px] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {course.blocks.map((b, bi) => (
                      <span key={bi} className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-md px-2 py-0.5 font-medium">
                        {DAY_NAMES[b.day]?.slice(0, 3) || `D${b.day}`} {b.start}–{b.end}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-neutral-400 mb-2.5">{editingIdx !== null ? 'Editando' : 'Nueva materia'}</div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la materia"
              className="input text-xs mb-2.5"
            />

            <div className="flex gap-1 mb-1">
              {DAY_NAMES.map((dName, i) => (
                <button key={i} onClick={() => toggleDay(i)} className={`pill flex-1 text-center py-1.5 ${selectedDays.includes(i) ? 'pill-active' : ''}`}>
                  {dName.slice(0, 3)}
                </button>
              ))}
            </div>
            <div className="flex gap-1 mb-2.5">
              {[
                { label: 'Lun–Vie', days: [0,1,2,3,4] },
                { label: 'Mar–Jue', days: [1,3] },
                { label: 'Lun–Mie–Vie', days: [0,2,4] },
              ].map(qr => (
                <button key={qr.label} onClick={() => setSelectedDays(qr.days)} className={`pill text-[10px] px-2 py-1 ${JSON.stringify(selectedDays) === JSON.stringify(qr.days) ? 'pill-active' : ''}`}>
                  {qr.label}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2 mb-2.5">
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1">Desde</label>
                <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="input w-24 text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1">Hasta</label>
                <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="input w-24 text-xs" />
              </div>
              <button onClick={handleAddBlock} disabled={selectedDays.length === 0} className="btn-secondary text-xs px-3 py-2.5 flex-shrink-0">
                + {selectedDays.length > 1 ? `${selectedDays.length} bloques` : 'Bloque'}
              </button>
            </div>

            {draftBlocks.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2.5">
                {draftBlocks.map((b, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md px-2 py-0.5 font-medium text-neutral-600 dark:text-neutral-300">
                    {DAY_NAMES[b.day]?.slice(0, 3) || `D${b.day}`} {b.start}–{b.end}
                    <button onClick={() => handleRemoveDraft(i)} aria-label="Quitar bloque" className="text-neutral-400 hover:text-red-500 ml-0.5 p-0.5 min-h-[20px] min-w-[20px] flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button onClick={handleSaveCourse} disabled={!canSave} className={`btn-primary flex-1 text-xs py-2 ${!canSave ? 'opacity-40 cursor-not-allowed' : ''}`}>
                {editingIdx !== null ? 'Guardar' : 'Agregar'}
              </button>
              {editingIdx !== null && (
                <button onClick={() => { setName(''); setDraftBlocks([]); setEditingIdx(null) }} className="btn-secondary text-xs px-3 py-2">Cancelar</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
