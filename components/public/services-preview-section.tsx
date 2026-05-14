'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Scissors, Clock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SERVICE_CATEGORIES } from '@/lib/types'
import type { Service } from '@/lib/types'

interface ServicesPreviewSectionProps {
  services: Service[]
}

// Gradient palettes for cards without image
const GRADIENTS = [
  'linear-gradient(135deg, #1a0a00 0%, #3d1f00 50%, #1a0a00 100%)',
  'linear-gradient(135deg, #0a0f1a 0%, #1a2f4a 50%, #0a0f1a 100%)',
  'linear-gradient(135deg, #0a1a0a 0%, #1a3d1a 50%, #0a1a0a 100%)',
  'linear-gradient(135deg, #1a0a1a 0%, #3d1a3d 50%, #1a0a1a 100%)',
  'linear-gradient(135deg, #1a1a0a 0%, #3d3d1a 50%, #1a1a0a 100%)',
  'linear-gradient(135deg, #0a1a1a 0%, #1a3d3d 50%, #0a1a1a 100%)',
]

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const router = useRouter()
  const gradient = GRADIENTS[index % GRADIENTS.length]!

  const handleClick = () => {
    router.push(`/reservar?service=${service.id}`)
  }

  const displayPrice = service.price_eur < 1
    ? 'Consultar'
    : `${service.price_eur.toFixed(2)} €`

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleClick}
      className="relative flex-shrink-0 cursor-pointer select-none"
      style={{ width: '280px' }}
    >
      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          height: '380px',
          background: '#111',
          border: '1px solid rgba(212,175,55,0.12)',
          borderRadius: '16px',
          transition: 'border-color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.5)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.12)'
        }}
      >
        {/* Image / gradient top area */}
        <div className="relative flex-shrink-0" style={{ height: '200px', overflow: 'hidden' }}>
          {service.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.image_url}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full" style={{ background: gradient }} />
          )}

          {/* Gold shimmer overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%)',
            }}
          />

          {/* Duration badge */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1"
            style={{
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Clock size={10} style={{ color: '#D4AF37' }} />
            <span className="text-[10px] font-medium" style={{ color: '#D4AF37' }}>
              {service.duration_min} min
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex-1">
            <h3 className="text-white font-serif text-lg leading-tight mb-1">
              {service.name}
            </h3>
            {service.description && (
              <p
                className="text-xs leading-relaxed line-clamp-2"
                style={{ color: 'rgba(161,161,170,0.7)' }}
              >
                {service.description}
              </p>
            )}
          </div>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="font-serif text-xl font-semibold" style={{ color: '#D4AF37' }}>
              {displayPrice}
            </span>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
              style={{
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '20px',
                color: '#D4AF37',
              }}
            >
              Reservar
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ServicesPreviewSection({ services }: ServicesPreviewSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('cortes')

  const SCROLL_AMOUNT = 300

  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' })
    setTimeout(updateArrows, 350)
  }

  const selectTab = (value: string) => {
    setActiveTab(value)
    // Reset carousel scroll position when changing category
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0
    }
    setTimeout(updateArrows, 50)
  }

  // Only show tabs for categories that have at least one service
  const usedCategories = SERVICE_CATEGORIES.filter((cat) =>
    services.some((s) => s.category === cat.value)
  )

  const filtered = services.filter((s) => s.category === activeTab)

  return (
    <section
      id="servicios"
      className="relative py-24 md:py-32"
      style={{ background: 'transparent' }}
    >
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium mb-3" style={{ color: '#D4AF37' }}>
              Lo que hacemos
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-white mb-4">
              Nuestros <span className="italic">Servicios</span>
            </h2>
            <div className="flex items-center gap-2" style={{ color: '#D4AF37' }}>
              <Scissors size={16} />
              <span className="text-xs uppercase tracking-[0.15em]">
                4.9 estrellas · 51 reseñas
              </span>
            </div>
          </div>

          {/* Arrow controls (desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canLeft}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: canLeft ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${canLeft ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: canLeft ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                cursor: canLeft ? 'pointer' : 'not-allowed',
              }}
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canRight}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: canRight ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${canRight ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: canRight ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                cursor: canRight ? 'pointer' : 'not-allowed',
              }}
              aria-label="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Category tabs */}
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-8">
        <div className="flex gap-2 justify-center flex-wrap">
          {usedCategories.map((cat) => (
            <CategoryTab
              key={cat.value}
              active={activeTab === cat.value}
              onClick={() => selectTab(cat.value)}
            >
              {cat.label}
            </CategoryTab>
          ))}
        </div>
        {/* Divider */}
        <div className="mt-3 h-px" style={{ background: 'rgba(212,175,55,0.15)' }} />
      </div>

      {/* Carousel track */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to right, rgba(5,5,5,0.8), transparent)',
            opacity: canLeft ? 1 : 0,
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, rgba(5,5,5,0.8), transparent)' }}
        />

        <div
          ref={trackRef}
          onScroll={updateArrows}
          className="overflow-x-auto pb-6"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div
            className="flex gap-5 mx-auto"
            style={{
              width: 'fit-content',
              paddingLeft: 'clamp(1.5rem, 6vw, 6rem)',
              paddingRight: 'clamp(1.5rem, 6vw, 6rem)',
            }}
          >
            {filtered.map((service, idx) => (
              <div key={service.id}>
                <ServiceCard service={service} index={idx} />
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm py-10" style={{ color: 'rgba(161,161,170,0.5)' }}>
                No hay servicios en esta categoría.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile arrow controls */}
      <div className="flex sm:hidden items-center justify-center gap-4 mt-6 px-6">
        <button
          onClick={() => scroll('left')}
          disabled={!canLeft}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: canLeft ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${canLeft ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: canLeft ? '#D4AF37' : 'rgba(255,255,255,0.2)',
          }}
          aria-label="Anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-xs" style={{ color: 'rgba(161,161,170,0.5)' }}>
          desliza para ver más
        </span>
        <button
          onClick={() => scroll('right')}
          disabled={!canRight}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: canRight ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${canRight ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: canRight ? '#D4AF37' : 'rgba(255,255,255,0.2)',
          }}
          aria-label="Siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  )
}

function CategoryTab({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 text-xs uppercase tracking-[0.12em] font-medium transition-all duration-200 whitespace-nowrap"
      style={{
        background: active ? 'rgba(212,175,55,0.15)' : 'transparent',
        border: `1px solid ${active ? '#D4AF37' : 'rgba(212,175,55,0.2)'}`,
        borderRadius: '20px',
        color: active ? '#D4AF37' : 'rgba(161,161,170,0.6)',
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  )
}
