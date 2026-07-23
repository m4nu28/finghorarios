import { useState, useCallback } from 'react'

const MOTIVATIONAL_QUOTES = [
  'Nadie termina la Fing sin tropezarse alguna vez.',
  'Una materia recursada no borra todo lo que aprendiste.',
  'No compares tu semestre con el de los demás.',
  'A veces aprobar una sola materia es un gran semestre.',
  'Elegir un buen horario también es parte de estudiar.',
  'No todo avance se mide en créditos.',
  'La constancia suele ganar donde la velocidad no alcanza.',
  'El objetivo no es terminar rápido. Es terminar.',
  'Una entrega difícil no define toda tu carrera.',
  'Volver a cursar también puede ser una forma de entender mejor.',
  'Organizar tu semana también es cuidar tu energía.',
  'En la Fing, seguir intentando ya es parte del camino.',
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

  const scrollToInfo = useCallback(() => {
    document.getElementById('landing-info')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div>
      {/* ═══════════════════════════════════════════
          FULL-SCREEN HERO
          ═══════════════════════════════════════════ */}
      <section className="hero-full relative overflow-hidden flex items-center justify-center">

        {/* Layer 1 — Building photo */}
        <div className="hero-photo absolute inset-0 pointer-events-none" aria-hidden="true" />

        {/* Layer 2 — Dark overlay */}
        <div className="hero-overlay absolute inset-0 pointer-events-none" aria-hidden="true" />

        {/* Layer 2b — Directional lighting and texture */}
        <div className="hero-light absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="hero-noise absolute inset-0 pointer-events-none" aria-hidden="true" />

        {/* Layer 3 — Gradient orbs (depth: far) */}
        <div className="hero-orb hero-orb-1 absolute rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="hero-orb hero-orb-2 absolute rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="hero-orb hero-orb-3 absolute rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        {/* Layer 4 — Connection dots (depth: near) */}
        <div className="hero-dot hero-dot-1 absolute rounded-full pointer-events-none" aria-hidden="true" />
        <div className="hero-dot hero-dot-2 absolute rounded-full pointer-events-none" aria-hidden="true" />
        <div className="hero-dot hero-dot-3 absolute rounded-full pointer-events-none hidden sm:block" aria-hidden="true" />
        <div className="hero-dot hero-dot-4 absolute rounded-full pointer-events-none hidden sm:block" aria-hidden="true" />

        {/* Layer 5 — Connection lines */}
        <div className="hero-line hero-line-1 absolute pointer-events-none hidden sm:block" aria-hidden="true" />
        <div className="hero-line hero-line-2 absolute pointer-events-none hidden sm:block" aria-hidden="true" />

        {/* Layer 7 — Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 25%, rgba(10,14,26,0.60) 100%)' }}
          aria-hidden="true"
        />

        {/* Layer 8 — Content */}
        <div className="hero-content relative z-10 text-center space-y-6 px-6 max-w-2xl mx-auto">
          <span className="hero-anim hero-badge inline-block text-[11px] font-medium tracking-widest uppercase text-accent-200" style={{ animationDelay: '0.2s' }}>
            Facultad de Ingeniería Udelar
          </span>
          <h2 className="hero-anim hero-title text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05]" style={{ animationDelay: '0.4s' }}>
            Planificá inteligente.<br />Cursá tranquilo.
          </h2>
          <p className="hero-anim hero-copy text-base sm:text-lg text-neutral-300 max-w-lg mx-auto leading-relaxed" style={{ animationDelay: '0.6s' }}>
            Seleccioná materias, marcá tus tiempos ocupados y obtené las mejores combinaciones de cursada en segundos.
          </p>
          <div className="hero-anim pt-2 flex items-center justify-center gap-3" style={{ animationDelay: '0.8s' }}>
            <button
              onClick={() => onNavigate('horarios')}
              className="btn-primary hero-primary"
            >
              Planificar mi horario
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button
              onClick={() => onNavigate('avance')}
              className="btn-secondary hero-secondary border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30"
            >
              Consultar avance
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 inset-x-0 z-10 flex justify-center hero-anim" style={{ animationDelay: '1.2s' }}>
          <button
            onClick={scrollToInfo}
            className="scroll-indicator flex flex-col items-center gap-1.5 text-white/55 hover:text-white transition-colors rounded-xl px-3 py-2"
            aria-label="Explorar información de FING Horarios"
          >
            <span className="text-[10px] font-medium tracking-widest uppercase">Explorar</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          REST OF PAGE
          ═══════════════════════════════════════════ */}
      <div id="landing-info" className="max-w-4xl mx-auto px-6 lg:px-8 py-20 space-y-24 scroll-mt-20">

        {/* Product summary */}
        <section className="info-panel relative overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white/90 dark:bg-neutral-900/70 p-6 sm:p-8 shadow-elevated backdrop-blur-xl">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.12),transparent_34%)]" aria-hidden="true" />
          <div className="relative grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-10 items-start">
            <div className="space-y-3">
              <p className="text-[11px] font-medium tracking-widest uppercase text-accent-600 dark:text-accent-400">Qué resuelve</p>
              <h3 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                Menos vueltas para armar tu semestre.
              </h3>
              <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                FingHorarios combina materias, grupos y restricciones reales para mostrarte opciones viables sin revisar cada horario a mano.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Sin choques',
              desc: 'Detecta superposiciones automáticamente.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              ),
              title: 'A tu medida',
              desc: 'Respeta horarios ocupados y preferencias.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              ),
              title: 'Datos reales',
              desc: 'Usa horarios oficiales de Bedelía.',
            },
              ].map((f, i) => (
                <div key={i} className="group flex gap-3 rounded-xl border border-neutral-200/70 dark:border-white/10 bg-neutral-50/80 dark:bg-white/[0.04] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-200 dark:hover:border-accent-700/70 hover:shadow-card">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 transition-transform duration-200 group-hover:scale-105">
                    {f.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">{f.title}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="grid sm:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-200/80 dark:bg-neutral-800">
          {[
            ['01', 'Elegís materias', 'Seleccionás las cursadas que querés planificar.'],
            ['02', 'Marcás restricciones', 'Agregás ocupaciones, fijos y preferencias.'],
            ['03', 'Comparás opciones', 'Ves combinaciones sin conflictos y ordenadas.'],
          ].map(([step, title, desc]) => (
            <div key={step} className="bg-white dark:bg-neutral-900 p-5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <span className="text-[11px] font-semibold text-accent-600 dark:text-accent-400">{step}</span>
              <h4 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-white">{title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{desc}</p>
            </div>
          ))}
        </section>

        {/* Motivational Section */}
        <MotivationalSection quoteIdx={quoteIdx} nextQuote={nextQuote} />

        {/* CTA Final */}
        <section className="flex flex-col items-center text-center space-y-4 py-4">
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
          Hero animation styles
          ═══════════════════════════════════════════ */}
      <style>{`
        /* ── Full-screen hero ──────────────────── */
        .hero-full {
          min-height: 100vh;
          min-height: 100dvh;
          isolation: isolate;
          background: #07111f;
        }

        /* ── Photo background ──────────────────── */
        .hero-photo {
          background-image: image-set(
            url('/finghero.webp') type('image/webp'),
            url('/finghero.jpg') type('image/jpeg')
          );
          background-repeat: no-repeat;
          background-position: center 54%;
          background-attachment: fixed;
          background-size: cover;
          transform: scale(1.01);
          filter: saturate(0.78) contrast(1.06) brightness(0.88);
          opacity: 0.94;
        }
        @media (max-width: 639px) {
          .hero-photo {
            background-attachment: scroll;
            background-size: cover;
            background-position: center bottom;
            transform: scale(1.01);
          }
        }

        /* ── Dark overlay ──────────────────────── */
        .hero-overlay {
          background:
            linear-gradient(90deg, rgba(5, 10, 20, 0.92) 0%, rgba(7, 17, 31, 0.72) 38%, rgba(7, 17, 31, 0.22) 72%, rgba(7, 17, 31, 0.55) 100%),
            linear-gradient(to bottom, rgba(5, 10, 20, 0.88) 0%, rgba(7, 17, 31, 0.34) 42%, rgba(7, 17, 31, 0.84) 100%);
        }

        .hero-light {
          background:
            radial-gradient(circle at 72% 28%, rgba(96, 165, 250, 0.28), transparent 26%),
            radial-gradient(circle at 42% 68%, rgba(79, 70, 229, 0.18), transparent 34%),
            linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.10) 44%, transparent 54%);
          mix-blend-mode: screen;
          opacity: 0.72;
          animation: heroLightShift 24s ease-in-out infinite alternate;
        }

        .hero-noise {
          opacity: 0.10;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.18) 0 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12) 0 1px, transparent 1px);
          background-size: 42px 42px, 58px 58px;
          mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
        }

        /* ── Gradient orbs (depth: far, slow) ──── */
        .hero-orb-1 {
          top: 10%; left: -10%;
          width: 26rem; height: 26rem;
          background: #6366f1;
          opacity: 0.14;
          animation: heroOrbPulse 18s ease-in-out infinite;
        }
        .hero-orb-2 {
          top: 0%; right: -6%;
          width: 20rem; height: 20rem;
          background: #7c3aed;
          opacity: 0.11;
          animation: heroOrbPulse 24s ease-in-out infinite 4s;
        }
        .hero-orb-3 {
          bottom: 8%; left: 25%;
          width: 16rem; height: 16rem;
          background: #06b6d4;
          opacity: 0.09;
          animation: heroOrbPulse 20s ease-in-out infinite 7s;
        }

        /* ── Connection dots (depth: near, fast) ─ */
        .hero-dot { background: rgba(165,180,252,0.5); }
        .hero-dot-1 {
          top: 30%; left: 30%;
          width: 5px; height: 5px;
          animation: heroDotPulse 5s ease-in-out infinite;
        }
        .hero-dot-2 {
          top: 55%; right: 20%;
          width: 4px; height: 4px;
          background: rgba(99,102,241,0.5);
          animation: heroDotPulse 7s ease-in-out infinite 2s;
        }
        .hero-dot-3 {
          top: 20%; right: 35%;
          width: 4px; height: 4px;
          background: rgba(199,210,254,0.4);
          animation: heroDotPulse 4s ease-in-out infinite 1s;
        }
        .hero-dot-4 {
          bottom: 30%; left: 40%;
          width: 3px; height: 3px;
          background: rgba(129,140,248,0.4);
          animation: heroDotPulse 6s ease-in-out infinite 3s;
        }

        /* ── Connection lines ──────────────────── */
        .hero-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent);
        }
        .hero-line-1 {
          top: 32%; left: 26%;
          width: 100px;
          transform: rotate(-12deg);
          animation: heroLinePulse 8s ease-in-out infinite;
        }
        .hero-line-2 {
          top: 54%; right: 18%;
          width: 80px;
          transform: rotate(8deg);
          animation: heroLinePulse 10s ease-in-out infinite 3s;
        }

        /* ── Focal content and interactions ─────── */
        .hero-content::before {
          content: '';
          position: absolute;
          inset: -4rem -5rem;
          z-index: -1;
          border-radius: 999px;
          background: radial-gradient(ellipse at center, rgba(7,17,31,0.66) 0%, rgba(7,17,31,0.40) 42%, transparent 72%);
          filter: blur(10px);
        }
        .hero-title {
          text-shadow: 0 1px 0 rgba(255,255,255,0.12), 0 24px 70px rgba(2,6,23,0.48);
        }
        .hero-copy {
          text-shadow: 0 10px 36px rgba(2,6,23,0.52);
        }
        .hero-badge {
          padding: 0.45rem 0.75rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 10px 34px rgba(2,6,23,0.20), inset 0 1px 0 rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
        }
        .hero-primary,
        .hero-secondary {
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background-color 220ms ease;
          box-shadow: 0 16px 42px rgba(79,70,229,0.28), inset 0 1px 0 rgba(255,255,255,0.16);
        }
        .hero-primary:hover,
        .hero-secondary:hover {
          transform: translateY(-2px) scale(1.015);
        }
        .hero-primary:hover {
          box-shadow: 0 24px 60px rgba(79,70,229,0.38), inset 0 1px 0 rgba(255,255,255,0.20);
        }
        .hero-secondary {
          backdrop-filter: blur(16px);
          box-shadow: 0 16px 44px rgba(2,6,23,0.28), inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .hero-secondary:hover {
          box-shadow: 0 24px 58px rgba(2,6,23,0.36), inset 0 1px 0 rgba(255,255,255,0.18);
        }

        /* ── Entrance animation ────────────────── */
        .hero-anim {
          opacity: 0;
          animation: heroFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* ── Scroll indicator ──────────────────── */
        .scroll-indicator {
          animation: scrollBounce 2s ease-in-out infinite;
        }

        /* ── Keyframes ──────────────────────────── */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes heroLightShift {
          0% { transform: translate3d(-1%, 0, 0); opacity: 0.62; }
          100% { transform: translate3d(1.2%, -0.8%, 0); opacity: 0.82; }
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
        }

        @keyframes heroOrbPulse {
          0%, 100% { transform: scale(1) translate3d(0, 0, 0); }
          50% { transform: scale(1.08) translate3d(1.2%, -1%, 0); }
        }

        @keyframes heroDotPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }

        @keyframes heroLinePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function MotivationalSection({ quoteIdx, nextQuote }) {
  return (
    <section className="flex justify-center">
      <div className="relative w-full sm:w-[26rem] overflow-hidden rounded-2xl border border-accent-200/70 dark:border-accent-300/20 bg-gradient-to-br from-white via-accent-50/70 to-sky-50/80 dark:from-[#07111f] dark:via-[#0d1830] dark:to-[#101827] p-5 sm:p-6 shadow-[0_24px_70px_-34px_rgba(79,70,229,0.42)] dark:shadow-[0_24px_70px_-28px_rgba(30,64,175,0.55)] transition-transform duration-200 hover:-translate-y-0.5">
        <div className="absolute inset-y-5 left-0 w-px bg-gradient-to-b from-transparent via-accent-500/50 dark:via-accent-400/70 to-transparent" aria-hidden="true" />
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-accent-300/25 dark:bg-accent-500/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-20 left-8 h-32 w-32 rounded-full bg-sky-300/20 dark:bg-cyan-400/10 blur-3xl" aria-hidden="true" />

        <div className="relative flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-[11px] font-medium text-accent-700/75 dark:text-accent-200/80 tracking-wide uppercase">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-400/15 dark:text-accent-200" aria-hidden="true">♥</span>
            Un recordatorio para hoy
          </p>
          <span className="text-[10px] text-accent-700/30 dark:text-white/25">
            {quoteIdx + 1}/{MOTIVATIONAL_QUOTES.length}
          </span>
        </div>

        <p
          key={quoteIdx}
          className="relative mt-5 text-base sm:text-lg font-medium text-neutral-800 dark:text-white/90 leading-relaxed"
          style={{ animation: 'fadeQuote 0.3s ease' }}
        >
          &ldquo;{MOTIVATIONAL_QUOTES[quoteIdx]}&rdquo;
        </p>

        <button
          onClick={nextQuote}
          className="relative ml-auto mt-5 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium text-accent-700/70 dark:text-accent-200/70 transition-colors hover:bg-accent-100/70 hover:text-accent-800 dark:hover:bg-white/10 dark:hover:text-accent-100"
        >
          Otra reflexión
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
