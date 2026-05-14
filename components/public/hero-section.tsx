'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const FALLBACK_BG = '/header.png'

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.4, 0, 0.2, 1] as const },
  }),
}

// [left, size(px), duration(s), delay(s), opacity]
const BUBBLES: [string, number, number, number, number][] = [
  ['2%',   14,  8,  0,    0.6 ],
  ['5%',   26,  12, 3,    0.4 ],
  ['8%',   10,  7,  1,    0.7 ],
  ['11%',  36,  20, 5,    0.2 ],
  ['14%',  18,  10, 2.5,  0.5 ],
  ['17%',  12,  8,  8,    0.65],
  ['20%',  44,  18, 0,    0.15],
  ['23%',  8,   6,  4,    0.75],
  ['26%',  22,  13, 7,    0.4 ],
  ['29%',  16,  9,  1.5,  0.55],
  ['32%',  32,  17, 11,   0.25],
  ['35%',  10,  7,  6,    0.68],
  ['38%',  20,  11, 0.5,  0.45],
  ['41%',  14,  8,  9,    0.6 ],
  ['44%',  28,  15, 3.5,  0.3 ],
  ['47%',  8,   6,  13,   0.72],
  ['50%',  38,  22, 2,    0.15],
  ['53%',  16,  9,  6.5,  0.52],
  ['56%',  12,  7,  0,    0.65],
  ['59%',  24,  13, 10,   0.35],
  ['62%',  10,  8,  4.5,  0.62],
  ['65%',  18,  10, 1,    0.48],
  ['68%',  48,  21, 7,    0.12],
  ['71%',  14,  8,  3,    0.58],
  ['74%',  22,  12, 12,   0.38],
  ['77%',  8,   6,  8.5,  0.7 ],
  ['80%',  30,  16, 0,    0.28],
  ['83%',  12,  8,  5.5,  0.6 ],
  ['86%',  18,  10, 2,    0.5 ],
  ['89%',  26,  14, 9,    0.32],
  ['92%',  10,  7,  14,   0.65],
  ['95%',  16,  9,  1.5,  0.55],
  ['98%',  40,  19, 4,    0.15],
  ['6%',   12,  8,  16,   0.58],
  ['16%',  8,   6,  18,   0.68],
  ['28%',  20,  11, 15,   0.42],
  ['42%',  14,  8,  17,   0.55],
  ['57%',  10,  7,  20,   0.62],
  ['73%',  16,  9,  19,   0.48],
  ['87%',  12,  8,  16.5, 0.58],
  ['13%',  34,  23, 9,    0.2 ],
  ['33%',  18,  14, 6,    0.45],
  ['48%',  26,  17, 11,   0.3 ],
  ['63%',  12,  9,  3,    0.6 ],
  ['78%',  22,  13, 8,    0.38],
]

export function HeroSection({ backgroundUrl }: { backgroundUrl?: string | undefined }) {
  const bgSrc = backgroundUrl || FALLBACK_BG
  const bgOpacity = 0.7
  const bgBlend = 'normal'
  return (
    <>
      <style>{`
        @keyframes bubble-rise {
          0%   { transform: translateY(0) scale(1);      opacity: 0; }
          6%   { opacity: 1; }
          94%  { opacity: 1; }
          100% { transform: translateY(-110vh) scale(0.5); opacity: 0; }
        }
        @keyframes shimmer-sweep {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ag-bubble {
          animation: bubble-rise var(--bd) var(--bdelay) infinite linear;
          will-change: transform, opacity;
        }
        .title-cinzel {
          font-family: var(--font-cinzel), 'Cinzel Decorative', Georgia, serif;
          background: linear-gradient(
            90deg,
            #B8860B 0%,
            #D4AF37 20%,
            #F5E070 42%,
            #FFFACD 50%,
            #F5E070 58%,
            #D4AF37 80%,
            #B8860B 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-sweep 5s linear infinite;
        }
      `}</style>

      {/* ── Fondo fijo ── */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden
      >
        {/* Base oscura cálida */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(170deg, #0E0804 0%, #1A0E07 25%, #140A05 50%, #1C1008 75%, #0D0703 100%)',
        }} />

        {/* Fondo: imagen madera (cuando esté subida) o foto del salón como textura */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: bgOpacity, mixBlendMode: bgBlend as React.CSSProperties['mixBlendMode'] }}
        />

        {/* Overlay tono madera cálido sobre la foto */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(170deg, rgba(30,12,4,0.75) 0%, rgba(20,8,3,0.6) 50%, rgba(25,10,4,0.75) 100%)',
          mixBlendMode: 'multiply',
        }} />

        {/* Vetas horizontales de madera */}
        <div className="absolute inset-0" style={{
          background: `repeating-linear-gradient(
            177deg,
            transparent       0px,
            transparent       4px,
            rgba(0,0,0,0.07)  4px,
            rgba(0,0,0,0.07)  5px,
            transparent       5px,
            transparent      11px,
            rgba(140,70,15,0.025) 11px,
            rgba(140,70,15,0.025) 12px
          )`,
          opacity: 0.8,
        }} />

        {/* Viñeta: oscurece los bordes, centra la luz */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 46%, transparent 20%, rgba(0,0,0,0.82) 100%)',
        }} />

        {/* Resplandor central cálido-dorado */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 55% 50% at 50% 44%, rgba(212,175,55,0.06) 0%, transparent 70%)',
        }} />

        {/* Burbujas doradas */}
        {BUBBLES.map(([left, size, dur, delay, opacity], i) => (
          <div
            key={i}
            className="ag-bubble absolute bottom-[-20px] rounded-full pointer-events-none select-none"
            style={{
              left,
              width:  size,
              height: size,
              '--bd':     `${dur}s`,
              '--bdelay': `${delay}s`,
              background: `radial-gradient(circle at 35% 30%, rgba(240,200,74,${opacity}), rgba(212,175,55,${opacity * 0.35}))`,
              boxShadow:  `0 0 ${size * 3}px rgba(212,175,55,${opacity * 0.35})`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ── Contenido ── */}
      <section
        className="relative h-screen flex flex-col items-center justify-center"
        style={{ zIndex: 1 }}
      >
        <div className="text-center px-6 md:px-12 max-w-5xl mx-auto w-full">

          {/* Overline con líneas */}
          <motion.div
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-4 mb-10"
          >
            <div style={{ width: 44, height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.65))' }} />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: '#D4AF37',
            }}>
              Tarragona · España · Est. 2019
            </span>
            <div style={{ width: 44, height: 1, background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.65))' }} />
          </motion.div>

          {/* Título Cinzel Decorative con shimmer dorado */}
          <motion.div
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <h1
              className="title-cinzel font-normal"
              style={{
                fontSize: 'clamp(2.2rem, 7vw, 5.5rem)',
                lineHeight: 1.15,
                letterSpacing: '0.04em',
                marginBottom: '0.1em',
              }}
            >
              AG Beauty Salon
            </h1>
          </motion.div>

          {/* Separador con rombo */}
          <motion.div
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-3 my-7"
          >
            <div style={{ width: 64, height: 1, background: 'rgba(212,175,55,0.4)' }} />
            <div style={{
              width: 7, height: 7,
              background: '#D4AF37',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 10px rgba(212,175,55,0.9)',
            }} />
            <div style={{ width: 64, height: 1, background: 'rgba(212,175,55,0.4)' }} />
          </motion.div>

          {/* Subtítulo */}
          <motion.p
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 400,
              color: '#9A9A9A',
              marginBottom: '2.5rem',
            }}
          >
            Barbería &amp; Salón de Belleza
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/reservar"
              className="cta-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#D4AF37',
                color: '#000',
                padding: '1rem 2.8rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              Reservar Cita
            </a>
            <a
              href="#servicios"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 2.8rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.68rem',
                fontWeight: 400,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(255,255,255,0.14)',
                transition: 'all 0.3s ease',
              }}
            >
              Ver Servicios
            </a>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          custom={5}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-10 md:gap-16"
        >
          <div className="text-center">
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '2.2rem', fontWeight: 400, color: '#D4AF37' }}>4.9</p>
            <div className="flex gap-0.5 justify-center mt-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A5A5A', marginTop: '5px' }}>
              Valoración
            </p>
          </div>
          <div style={{ width: 1, height: 52, background: 'rgba(212,175,55,0.16)' }} />
          <div className="text-center">
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '2.2rem', fontWeight: 400, color: '#F5F5F5' }}>+100</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A5A5A', marginTop: '5px' }}>
              Reseñas
            </p>
          </div>
          <div style={{ width: 1, height: 52, background: 'rgba(212,175,55,0.16)' }} />
          <div className="text-center">
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '2.2rem', fontWeight: 400, color: '#F5F5F5' }}>7+</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A5A5A', marginTop: '5px' }}>
              Años
            </p>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              width: 1,
              height: 30,
              background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), transparent)',
              margin: '0 auto',
            }}
          />
        </motion.div>
      </section>
    </>
  )
}
