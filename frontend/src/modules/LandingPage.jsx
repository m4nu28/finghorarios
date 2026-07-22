import { useState, useCallback } from 'react'

const MOTIVATIONAL_QUOTES = [
  'Avanzar lento también es avanzar.',
  'Una materia difícil no define tu capacidad.',
  'No tenés que entender todo a la primera.',
  'Recursar no significa volver al comienzo.',
  'Cada materia aprobada alguna vez pareció imposible.',
  'Tu carrera no tiene que llevar el mismo ritmo que la de los demás.',
  'Descansar también forma parte de seguir.',
  'No midas todo tu progreso por un solo parcial.',
  'Pedir ayuda también es una forma de avanzar.',
  'Llegar más tarde sigue siendo llegar.',
  'No estás atrasado: estás recorriendo tu propio proceso.',
  'A veces el progreso es sentarte a intentarlo una vez más.',
]

function pickDifferent(current) {
  if (MOTIVATIONAL_QUOTES.length <= 1) return 0
  let next
  do {
    next = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  } while (next === current)
  return next
}

export default function LandingPage({ onNavigate }) {
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length))

  const nextQuote = useCallback(() => {
    setQuoteIdx(i => pickDifferent(i))
  }, [])

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-20 pb-16 space-y-24">

        {/* Hero — building photo with animated overlay */}
        <section className="hero-container relative overflow-hidden rounded-2xl bg-[#0a0e1a] min-h-[420px] sm:min-h-[480px] flex items-center justify-center py-16 sm:py-20 shadow-[0_0_80px_-20px_rgba(99,102,241,0.12)]">

          {/* Layer 1 — Building photo with parallax */}
          <div className="hero-photo absolute inset-0 pointer-events-none" aria-hidden="true" />

          {/* Layer 2 — Dark overlay */}
          <div className="hero-overlay absolute inset-0 pointer-events-none" aria-hidden="true" />

          {/* Layer 3 — Gradient orbs */}
          <div className="hero-orb hero-orb-1 absolute rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="hero-orb hero-orb-2 absolute rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="hero-orb hero-orb-3 absolute rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          {/* Layer 4 — Course blocks */}
          <div className="hero-block hero-block-1 absolute rounded-xl pointer-events-none" aria-hidden="true" />
          <div className="hero-block hero-block-2 absolute rounded-xl pointer-events-none" aria-hidden="true" />
          <div className="hero-block hero-block-3 absolute rounded-xl pointer-events-none" aria-hidden="true" />
          <div className="hero-block hero-block-4 absolute rounded-xl pointer-events-none hidden sm:block" aria-hidden="true" />
          <div className="hero-block hero-block-5 absolute rounded-xl pointer-events-none hidden sm:block" aria-hidden="true" />
          <div className="hero-block hero-block-6 absolute rounded-xl pointer-events-none hidden sm:block" aria-hidden="true" />

          {/* Layer 5 — Connection dots */}
          <div className="hero-dot hero-dot-1 absolute rounded-full pointer-events-none" aria-hidden="true" />
          <div className="hero-dot hero-dot-2 absolute rounded-full pointer-events-none" aria-hidden="true" />
          <div className="hero-dot hero-dot-3 absolute rounded-full pointer-events-none hidden sm:block" aria-hidden="true" />
          <div className="hero-dot hero-dot-4 absolute rounded-full pointer-events-none hidden sm:block" aria-hidden="true" />

          {/* Layer 6 — Connection lines */}
          <div className="hero-line hero-line-1 absolute pointer-events-none hidden sm:block" aria-hidden="true" />
          <div className="hero-line hero-line-2 absolute pointer-events-none hidden sm:block" aria-hidden="true" />

          {/* Layer 7 — Readability veil */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(10,14,26,0.55) 100%)' }}
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10 text-center space-y-5 px-6">
            <span className="inline-block text-[11px] font-medium tracking-widest uppercase text-accent-400">
              Facultad de Ingeniería Udelar
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Tu horario,<br />armado por vos.
            </h2>
            <p className="text-base text-neutral-400 max-w-md mx-auto leading-relaxed">
              Seleccioná materias, marcá tus tiempos ocupados y obtené las mejores combinaciones de cursada en segundos.
            </p>
            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('horarios')}
                className="btn-primary"
              >
                Planificar mi horario
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                onClick={() => onNavigate('avance')}
                className="btn-secondary"
              >
                Consultar avance
              </button>
            </div>
          </div>
        </section>

        {/* Features strip */}
        <section className="grid sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Sin choques',
              desc: 'Cada combinación se verifica contra tus horarios ocupados.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              ),
              title: 'A tu medida',
              desc: 'Fijás qué pesa más: días libres, horarios, cantidad de materias.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              ),
              title: 'Datos reales',
              desc: 'Horarios tomados directamente de Bedelía. Sin inventar.',
            },
          ].map((f, i) => (
            <div key={i} className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 mx-auto sm:mx-0">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{f.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* How it works — compact inline */}
        <section className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10">
          <div className="flex-1 space-y-1">
            <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-400 dark:text-neutral-500">Cómo funciona</p>
          </div>
          <div className="flex-1 space-y-3">
            {[
              'Buscás y elegís las materias que querés cursar.',
              'Definís horarios fijos, ocupados y preferencias.',
              'El sistema genera las mejores opciones sin conflictos.',
            ].map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Motivational Section */}
        <MotivationalSection quoteIdx={quoteIdx} nextQuote={nextQuote} />

        {/* CTA Final */}
        <section className="text-center space-y-4 py-4">
          <button
            onClick={() => onNavigate('horarios')}
            className="btn-primary"
          >
            Armá tu horario ahora
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Gratis. Sin registro.</p>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-200/60 dark:border-neutral-800/60 pt-6 pb-8 text-center">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            FING Horarios — Herramienta no oficial. Estudiantes de Ingeniería, Udelar.
          </p>
        </footer>
      </div>

      {/* ═══════════════════════════════════════════
          Hero background animation styles
          ═══════════════════════════════════════════ */}
      <style>{`
        /* ── Photo background ───────────────────── */
        .hero-photo {
          background-image: url('/edificiofing8.jpg');
          background-size: cover;
          background-position: center 30%;
          background-attachment: fixed;
        }
        @media (max-width: 639px) {
          .hero-photo {
            background-attachment: scroll;
            background-position: center 25%;
          }
        }

        /* ── Dark overlay ───────────────────────── */
        .hero-overlay {
          background: linear-gradient(
            to bottom,
            rgba(10, 14, 26, 0.80) 0%,
            rgba(10, 14, 26, 0.60) 35%,
            rgba(10, 14, 26, 0.60) 65%,
            rgba(10, 14, 26, 0.78) 100%
          );
        }

        /* ── Gradient orbs ──────────────────────── */
        .hero-orb-1 {
          top: 8%; left: -8%;
          width: 22rem; height: 22rem;
          background: #6366f1;
          opacity: 0.10;
          animation: heroOrbPulse 12s ease-in-out infinite;
        }
        .hero-orb-2 {
          top: 5%; right: -4%;
          width: 17rem; height: 17rem;
          background: #7c3aed;
          opacity: 0.08;
          animation: heroOrbPulse 15s ease-in-out infinite 3s;
        }
        .hero-orb-3 {
          bottom: 5%; left: 28%;
          width: 14rem; height: 14rem;
          background: #06b6d4;
          opacity: 0.07;
          animation: heroOrbPulse 10s ease-in-out infinite 6s;
        }

        /* ── Course blocks ──────────────────────── */
        .hero-block {
          opacity: 1;
        }
        .hero-block-1 {
          top: 15%; left: 10%;
          width: 4.5rem; height: 2.5rem;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.20);
          animation: heroBlockDrift1 35s ease-in-out infinite;
        }
        .hero-block-2 {
          top: 42%; right: 10%;
          width: 5.5rem; height: 3rem;
          background: rgba(129,140,248,0.13);
          border: 1px solid rgba(129,140,248,0.18);
          animation: heroBlockDrift2 30s ease-in-out infinite 2s;
        }
        .hero-block-3 {
          bottom: 22%; left: 20%;
          width: 4rem; height: 2.5rem;
          background: rgba(67,56,202,0.13);
          border: 1px solid rgba(67,56,202,0.18);
          animation: heroBlockDrift3 40s ease-in-out infinite 4s;
        }
        .hero-block-4 {
          top: 22%; right: 28%;
          width: 3.5rem; height: 2rem;
          background: rgba(165,180,252,0.13);
          border: 1px solid rgba(165,180,252,0.18);
          animation: heroBlockDrift1 28s ease-in-out infinite 1s;
        }
        .hero-block-5 {
          bottom: 12%; right: 12%;
          width: 4.5rem; height: 2.5rem;
          background: rgba(99,102,241,0.11);
          border: 1px solid rgba(99,102,241,0.16);
          animation: heroBlockDrift2 38s ease-in-out infinite 5s;
        }
        .hero-block-6 {
          top: 58%; left: 6%;
          width: 3rem; height: 2rem;
          background: rgba(129,140,248,0.13);
          border: 1px solid rgba(129,140,248,0.18);
          animation: heroBlockDrift3 32s ease-in-out infinite 3s;
        }

        /* ── Connection dots ────────────────────── */
        .hero-dot {
          background: rgba(165,180,252,0.5);
        }
        .hero-dot-1 {
          top: 28%; left: 32%;
          width: 5px; height: 5px;
          animation: heroDotPulse 5s ease-in-out infinite;
        }
        .hero-dot-2 {
          top: 58%; right: 22%;
          width: 4px; height: 4px;
          background: rgba(99,102,241,0.5);
          animation: heroDotPulse 7s ease-in-out infinite 2s;
        }
        .hero-dot-3 {
          top: 18%; right: 38%;
          width: 4px; height: 4px;
          background: rgba(199,210,254,0.4);
          animation: heroDotPulse 4s ease-in-out infinite 1s;
        }
        .hero-dot-4 {
          bottom: 32%; left: 42%;
          width: 3px; height: 3px;
          background: rgba(129,140,248,0.4);
          animation: heroDotPulse 6s ease-in-out infinite 3s;
        }

        /* ── Connection lines ───────────────────── */
        .hero-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent);
        }
        .hero-line-1 {
          top: 30%; left: 28%;
          width: 90px;
          transform: rotate(-12deg);
          animation: heroLinePulse 8s ease-in-out infinite;
        }
        .hero-line-2 {
          top: 56%; right: 20%;
          width: 70px;
          transform: rotate(8deg);
          animation: heroLinePulse 10s ease-in-out infinite 3s;
        }

        /* ── Keyframes ──────────────────────────── */
        @keyframes heroOrbPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }

        @keyframes heroBlockDrift1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(8px, -10px); }
        }
        @keyframes heroBlockDrift2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, 8px); }
        }
        @keyframes heroBlockDrift3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(5px, -6px); }
          66% { transform: translate(-4px, 8px); }
        }

        @keyframes heroDotPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.75; }
        }

        @keyframes heroLinePulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function MotivationalSection({ quoteIdx, nextQuote }) {
  return (
    <section>
      <div className="card p-6 sm:p-8 space-y-4 bg-neutral-50/80 dark:bg-neutral-900/80 border-neutral-200/60 dark:border-neutral-800/60">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 tracking-wide uppercase">
            Un recordatorio para seguir
          </p>
          <span className="text-[10px] text-neutral-300 dark:text-neutral-600">
            {quoteIdx + 1}/{MOTIVATIONAL_QUOTES.length}
          </span>
        </div>

        <p
          key={quoteIdx}
          className="text-base sm:text-lg font-medium text-neutral-700 dark:text-neutral-200 leading-relaxed"
          style={{ animation: 'fadeQuote 0.3s ease' }}
        >
          &ldquo;{MOTIVATIONAL_QUOTES[quoteIdx]}&rdquo;
        </p>

        <button
          onClick={nextQuote}
          className="btn-ghost text-xs px-3 py-1.5 -ml-3"
        >
          Otra frase
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes fadeQuote {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
