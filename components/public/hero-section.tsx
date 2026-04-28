'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function VinesSVGFar() {
  return (
    <svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Main stem — top left corner descending */}
      <motion.path
        d="M-20 0 C60 80, 40 200, 120 280 C200 360, 180 480, 100 600"
        stroke="#2D6B2D"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 3, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
      {/* Branch left */}
      <motion.path
        d="M80 180 C140 150, 180 120, 240 90"
        stroke="#2D6B2D"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
      />
      {/* Leaf top-left */}
      <motion.ellipse
        cx="55" cy="220" rx="22" ry="13"
        fill="#1F4A1F"
        transform="rotate(-40 55 220)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.45 }}
        transition={{ duration: 1.2, delay: 1.1 }}
        style={{ transformOrigin: '55px 220px' }}
      />
      {/* Bottom right corner stem */}
      <motion.path
        d="M1460 900 C1380 820, 1400 700, 1320 620 C1240 540, 1260 420, 1340 300"
        stroke="#2D6B2D"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 3, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      />
      {/* Branch bottom-right */}
      <motion.path
        d="M1360 740 C1300 720, 1260 680, 1200 650"
        stroke="#2D6B2D"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.45 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
      />
      {/* Leaf bottom-right */}
      <motion.ellipse
        cx="1390" cy="680" rx="20" ry="11"
        fill="#1F4A1F"
        transform="rotate(35 1390 680)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1.2, delay: 1.4 }}
        style={{ transformOrigin: '1390px 680px' }}
      />
      {/* Top right tendril */}
      <motion.path
        d="M1440 0 C1360 60, 1380 140, 1300 200 C1240 250, 1280 320, 1200 380"
        stroke="#2D6B2D"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
      />
    </svg>
  )
}

function VinesSVGNear() {
  return (
    <svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Thick stem bottom-left */}
      <motion.path
        d="M-40 900 C40 820, 20 720, 100 640 C160 580, 130 480, 60 380"
        stroke="#5A8F5A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      />
      {/* Large leaf bottom-left */}
      <motion.path
        d="M50 750 C20 720, -10 680, 30 650 C70 620, 100 650, 80 700 C70 730, 55 745, 50 750Z"
        fill="#2D6B2D"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.55 }}
        transition={{ duration: 1.4, delay: 1.0 }}
        style={{ transformOrigin: '50px 700px' }}
      />
      {/* Side branch */}
      <motion.path
        d="M80 680 C140 660, 190 640, 240 600"
        stroke="#5A8F5A"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
      />
      {/* Small leaf on branch */}
      <motion.ellipse
        cx="190" cy="630" rx="16" ry="9"
        fill="#5A8F5A"
        transform="rotate(-25 190 630)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1, delay: 1.6 }}
        style={{ transformOrigin: '190px 630px' }}
      />
      {/* Thick stem top-right */}
      <motion.path
        d="M1480 -20 C1400 80, 1420 180, 1340 260 C1280 320, 1300 440, 1380 540"
        stroke="#5A8F5A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.65 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
      />
      {/* Large leaf top-right */}
      <motion.path
        d="M1400 120 C1430 90, 1460 80, 1450 120 C1440 150, 1415 155, 1400 140 C1392 133, 1396 126, 1400 120Z"
        fill="#2D6B2D"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1.4, delay: 1.1 }}
        style={{ transformOrigin: '1430px 120px' }}
      />
      {/* Curl tendril */}
      <motion.path
        d="M1340 260 C1360 240, 1390 245, 1385 265 C1380 280, 1360 275, 1358 260"
        stroke="#7CB87C"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 1.2, delay: 1.8 }}
      />
    </svg>
  )
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const yBg      = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])
  const yFar     = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const yNear    = useTransform(scrollYProgress, [0, 1], ['0%', '-55%'])
  const opacity  = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden flex items-center justify-center"
      style={{ background: 'var(--color-black)' }}
    >
      {/* Layer 1 — Background gradient (no photo yet — added in Sprint 10) */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 scale-110"
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(31,74,31,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(13,26,13,0.5) 0%, transparent 50%)',
          }}
        />
      </motion.div>

      {/* Layer 2 — Vines far */}
      <motion.div
        style={{ y: yFar }}
        className="absolute inset-0 pointer-events-none"
      >
        <VinesSVGFar />
      </motion.div>

      {/* Layer 3 — Vines near */}
      <motion.div
        style={{ y: yNear }}
        className="absolute inset-0 pointer-events-none"
      >
        <VinesSVGNear />
      </motion.div>

      {/* Layer 4 — Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.span
          className="label block mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Barbería &amp; salón de belleza — Tarragona
        </motion.span>

        <motion.h1
          className="heading-xl mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          Tu estilo,{' '}
          <em
            className="not-italic"
            style={{ color: 'var(--color-green-light)' }}
          >
            nuestra pasión
          </em>
        </motion.h1>

        <motion.p
          className="body max-w-md mx-auto mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
        >
          Cortes, arreglo de barba y más en el corazón de Tarragona.
          Reserva tu cita en segundos.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          <Link href="/reservar" className="btn-primary">
            Reservar cita
          </Link>
          <Link href="/servicios" className="btn-outline">
            Ver servicios
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="label-sm" style={{ color: 'var(--color-white-subtle)' }}>
          Desliza
        </span>
        <motion.div
          className="w-px h-8"
          style={{ background: 'linear-gradient(to bottom, var(--color-green-mid), transparent)' }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
