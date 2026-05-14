'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  service_name: string | null
  source: 'google' | 'booksy' | 'manual'
}

const SOURCE_BADGE: Record<string, { label: string; color: string }> = {
  google:  { label: 'Google',  color: '#4285F4' },
  booksy:  { label: 'Booksy',  color: '#9B59B6' },
  manual:  { label: '',        color: 'transparent' },
}

function ReviewCard({ review }: { review: Review }) {
  const badge = SOURCE_BADGE[review.source]

  return (
    <div
      className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[32%] rounded-xl p-8 flex flex-col"
      style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Stars + source */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-0.5">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
          ))}
        </div>
        {badge && badge.label && (
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: `${badge.color}22`,
              color: badge.color,
              border: `1px solid ${badge.color}44`,
            }}
          >
            {badge.label}
          </span>
        )}
      </div>

      <p className="text-[#A1A1AA] font-light leading-relaxed text-sm mb-6 flex-1">
        &ldquo;{review.comment ?? ''}&rdquo;
      </p>

      <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-white font-medium text-sm">{review.customer_name}</p>
        {review.service_name && (
          <p className="text-[#A1A1AA] text-xs mt-1">{review.service_name}</p>
        )}
      </div>
    </div>
  )
}

interface TestimonialsSectionProps {
  reviews: Review[]
  averageRating: number
  totalCount: number
}

export function TestimonialsSection({ reviews, averageRating, totalCount }: TestimonialsSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (reviews.length === 0) return null

  return (
    <section
      id="opiniones"
      className="relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#D4AF37] mb-4">
              Opiniones
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-white">
              Lo que dicen <span className="italic">nuestros clientes</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <span className="text-white font-serif text-lg font-semibold ml-1">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-[#A1A1AA] text-sm">({totalCount})</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                aria-label="Anterior"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:border-[#D4AF37] transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <ChevronLeft size={18} className="text-white" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Siguiente"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:border-[#D4AF37] transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <ChevronRight size={18} className="text-white" />
              </button>
            </div>
          </motion.div>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-6">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
