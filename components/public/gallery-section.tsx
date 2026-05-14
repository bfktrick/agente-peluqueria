'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BASE = 'https://kluruxhjziayommqnfeo.supabase.co/storage/v1/object/public/gallery'

const FALLBACK_IMAGES = [
  `${BASE}/salon-06.jpg`,
  `${BASE}/salon-07.jpg`,
  `${BASE}/salon-01.jpg`,
  `${BASE}/salon-03.jpg`,
]

const BENTO_CLASSES = [
  'col-span-1 md:col-span-2 row-span-2',
  'col-span-1 md:col-span-2',
  'col-span-1',
  'col-span-1 md:col-span-3',
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const },
  },
}

function Lightbox({
  imgs,
  index,
  onClose,
}: {
  imgs: string[]
  index: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(index)

  const prev = useCallback(() => setCurrent((i) => (i - 1 + imgs.length) % imgs.length), [imgs.length])
  const next = useCallback(() => setCurrent((i) => (i + 1) % imgs.length), [imgs.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      {/* Image */}
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative max-w-5xl max-h-[85vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgs[current]}
          alt={`AG Beauty Salon — ${current + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-xl"
          style={{ border: '1px solid rgba(212,175,55,0.15)' }}
        />

        {/* Counter */}
        <p
          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs tracking-widest"
          style={{ color: 'rgba(212,175,55,0.7)' }}
        >
          {current + 1} / {imgs.length}
        </p>
      </motion.div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'white',
          fontSize: '18px',
        }}
        aria-label="Cerrar"
      >
        ✕
      </button>

      {/* Prev / Next — only show if more than one image */}
      {imgs.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: '#D4AF37',
              fontSize: '20px',
            }}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: '#D4AF37',
              fontSize: '20px',
            }}
            aria-label="Siguiente"
          >
            ›
          </button>
        </>
      )}
    </motion.div>
  )
}

export function GallerySection({ images }: { images: string[] | undefined }) {
  const imgs = images && images.length > 0 ? images : FALLBACK_IMAGES
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <section
        id="galeria"
        className="relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#D4AF37] mb-4">
              Nuestro trabajo
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-white">
              Galería
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]"
          >
            {imgs.map((url, idx) => (
              <motion.div
                key={url}
                variants={imageVariants}
                onClick={() => setLightboxIndex(idx)}
                className={`gallery-img-wrapper rounded-xl overflow-hidden relative group cursor-pointer ${BENTO_CLASSES[idx] ?? 'col-span-1 md:col-span-2'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`AG Beauty Salon — trabajo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                  <span
                    className="text-white text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 tracking-wider uppercase px-4 py-2 rounded-full"
                    style={{ border: '1px solid rgba(212,175,55,0.5)', color: '#D4AF37' }}
                  >
                    Ver
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            imgs={imgs}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
