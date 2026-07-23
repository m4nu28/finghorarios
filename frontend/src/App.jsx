import { useState, useEffect } from 'react'
import useUrlState from './hooks/useUrlState'
import LandingPage from './modules/LandingPage'
import HorariosModule from './modules/HorariosModule'
import ConsultaDeAvance from './modules/ConsultaDeAvance'

const TABS = [
  { id: 'horarios', label: 'Horarios', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )},
  { id: 'avance', label: 'Consulta de avance', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
    </svg>
  )},
]

const isLanding = (tab) => tab === 'landing' || tab === null

export default function App() {
  const [activeTab, setActiveTab] = useUrlState('tab', 'landing')
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('finghorarios_dark')
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('finghorarios_dark', dark) } catch {}
  }, [dark])

  useEffect(() => {
    fetch('/api/courses/?limit=1')
      .then(r => { if (!r.ok) throw new Error() })
      .catch(() => setLoadError('No se pudo conectar con el servidor. Verificá que esté corriendo.'))
  }, [])

  const onLanding = isLanding(activeTab)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      <header className={`top-0 z-40 transition-colors duration-200 ${
        onLanding
          ? 'fixed inset-x-0 bg-[#07111f]/35 border-b border-white/10 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : 'sticky bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 group"
          >
            <h1 className={`text-sm font-semibold tracking-tight transition-colors ${
              onLanding
                ? 'text-white group-hover:text-accent-300'
                : 'text-neutral-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400'
            }`}>FING Horarios</h1>
          </button>

          {!onLanding && (
            <nav className="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-100 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          )}

          <button
            onClick={() => setDark(d => !d)}
            className={`btn-ghost p-1.5 rounded-lg ${onLanding ? 'text-white/70 hover:text-white hover:bg-white/10' : ''}`}
            aria-label={dark ? 'Modo claro' : 'Modo oscuro'}
          >
            {dark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className={`${onLanding ? '' : 'max-w-7xl mx-auto px-6 lg:px-8 py-6'}`}>
        {onLanding && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'horarios' && <HorariosModule loadError={loadError} />}
        {activeTab === 'avance' && <ConsultaDeAvance />}
      </main>
    </div>
  )
}
