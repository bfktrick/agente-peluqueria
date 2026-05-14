'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const FALLBACK_IMAGE =
  'https://kluruxhjziayommqnfeo.supabase.co/storage/v1/object/public/gallery/salon-05.jpg'

export function ExperienceSection({ imageUrl }: { imageUrl: string | undefined }) {
  const EXPERIENCE_IMAGE = imageUrl ?? FALLBACK_IMAGE
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])

  return (
    <section
      ref={sectionRef}
      id="experiencia"
      className="relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text column */}
          <motion.div style={{ y: textY }} className="order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.2em] font-medium text-[#D4AF37] mb-4"
            >
              La experiencia
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-white mb-8"
            >
              Más que un <span className="italic">corte</span>,<br />
              una experiencia
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#A1A1AA] font-light leading-relaxed mb-6"
            >
              En AG Beauty Salon, cada visita es un momento de calma y transformación.
              Nuestro espacio está diseñado para que te sientas en manos de profesionales
              que entienden tu estilo y lo elevan.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[#A1A1AA] font-light leading-relaxed mb-8"
            >
              Desde la primera consulta hasta el resultado final, nos enfocamos
              en los detalles que hacen la diferencia. Técnica, precisión y un
              toque de elegancia en cada servicio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex gap-8"
            >
              {[
                { value: '4.9', label: 'Valoración' },
                { value: '51+', label: 'Reseñas' },
                { value: '10+', label: 'Servicios' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-3xl text-[#D4AF37] font-semibold">{stat.value}</p>
                  <p className="text-xs text-[#A1A1AA] uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image column */}
          <motion.div style={{ y: imageY }} className="order-1 lg:order-2 relative">
            <div className="relative overflow-hidden rounded-2xl">
              <motion.img
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                src={EXPERIENCE_IMAGE}
                alt="AG Beauty Salon Experience"
                className="w-full h-[400px] md:h-[550px] object-cover"
                loading="lazy"
              />
              {/* Gold inset border */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ border: '1px solid rgba(212,175,55,0.15)' }}
              />
            </div>
            {/* Floating circle decoration */}
            <div
              className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full"
              style={{ border: '1px solid rgba(212,175,55,0.2)' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
