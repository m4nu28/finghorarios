const CARRERAS = [
  { id: 'civ', name: 'Ingeniería Civil', color: 'bg-blue-500' },
  { id: 'com', name: 'Ingeniería en Computación', color: 'bg-violet-500' },
  { id: 'ela', name: 'Ingeniería Electricista', color: 'bg-amber-600' },
  { id: 'ele', name: 'Ingeniería Electrónica', color: 'bg-cyan-500' },
  { id: 'ind', name: 'Ingeniería Industrial', color: 'bg-rose-500' },
  { id: 'meb', name: 'Ingeniería Mecánica', color: 'bg-orange-500' },
  { id: 'met', name: 'Ingeniería Metalúrgica', color: 'bg-slate-500' },
  { id: 'qui', name: 'Ingeniería Química', color: 'bg-teal-500' },
  { id: 'nav', name: 'Ingeniería Naval', color: 'bg-sky-500' },
  { id: 'san', name: 'Ingeniería Sanitaria', color: 'bg-lime-500' },
  { id: 'tra', name: 'Ingeniería de Transporte', color: 'bg-indigo-500' },
  { id: 'ali', name: 'Ingeniería de Alimentos', color: 'bg-pink-500' },
]

export default function ConsultaDeAvance({ selectedCarrera, onSelectCarrera }) {
  return (
    <div className="flex gap-8 min-h-[calc(100vh-10rem)]">
      <aside className="w-64 flex-shrink-0">
        <div className="card p-0 overflow-hidden sticky top-24">
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Carreras</label>
          </div>
          <nav className="p-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {CARRERAS.map((carrera) => (
              <button
                key={carrera.id}
                onClick={() => onSelectCarrera(carrera.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center gap-2.5 ${
                  selectedCarrera === carrera.id
                    ? 'bg-accent-50 dark:bg-accent-950/30 text-accent-700 dark:text-accent-400 font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${carrera.color} flex-shrink-0`} />
                <span className="truncate">{carrera.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {!selectedCarrera ? (
          <div className="card flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-3xl flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Seleccioná una carrera</h3>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-xs">
              Elegí tu carrera del panel lateral para consultar tu avance académico.
            </p>
          </div>
        ) : (
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-3 h-3 rounded-full ${CARRERAS.find(c => c.id === selectedCarrera)?.color}`} />
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                {CARRERAS.find(c => c.id === selectedCarrera)?.name}
              </h2>
            </div>
            <div className="text-center py-16">
              <p className="text-sm text-neutral-400 dark:text-neutral-500">Próximamente: consulta de avance por materia.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
