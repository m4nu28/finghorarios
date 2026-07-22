import usePersistedState from '../hooks/usePersistedState'

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

export default function ConsultaDeAvance() {
  const [selectedCarrera, setSelectedCarrera] = usePersistedState('finghorarios_carrera', null)

  const selectedName = CARRERAS.find(c => c.id === selectedCarrera)

  return (
    <div>
      <div className="lg:hidden mb-4 overflow-x-auto -mx-6 px-6">
        <div className="flex gap-1.5 min-w-max">
          {CARRERAS.map((carrera) => (
            <button
              key={carrera.id}
              onClick={() => setSelectedCarrera(carrera.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-100 ${
                selectedCarrera === carrera.id
                  ? 'bg-accent-50 dark:bg-accent-950/30 text-accent-700 dark:text-accent-400'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${carrera.color} flex-shrink-0`} />
              {carrera.name.replace('Ingeniería ', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-20">
            <span className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 px-1">Carreras</span>
            <nav className="space-y-0.5">
              {CARRERAS.map((carrera) => (
                <button
                  key={carrera.id}
                  onClick={() => setSelectedCarrera(carrera.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-100 flex items-center gap-2 ${
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

        <div className="flex-1 min-w-0 border-t border-neutral-200 dark:border-neutral-800 pt-6">
          {!selectedCarrera ? (
            <div className="text-center py-20">
              <p className="text-sm text-neutral-400 dark:text-neutral-500">Elegí una carrera para consultar tu avance académico.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${selectedName?.color}`} />
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {selectedName?.name}
                </h2>
              </div>
              <p className="text-sm text-neutral-400 dark:text-neutral-500">Próximamente: consulta de avance por materia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
