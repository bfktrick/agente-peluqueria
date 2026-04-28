import Link from 'next/link'
import { FadeIn } from '@/components/ui/fade-in'
import type { Service } from '@/lib/types'

interface ServicesPreviewSectionProps {
  services: Service[]
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <FadeIn delay={index * 0.12} direction="up">
      <div className="card-dark-hover p-8 flex flex-col gap-4">
        {/* Duration tag */}
        <span className="badge-green self-start">{service.duration_min} min</span>

        <div>
          <h3 className="heading-sm mb-2">{service.name}</h3>
          {service.description && (
            <p className="body-sm">{service.description}</p>
          )}
        </div>

        <div className="flex items-end justify-between mt-auto pt-4" style={{ borderTop: '1px solid var(--color-surface-3)' }}>
          <span
            className="font-serif text-2xl"
            style={{ color: 'var(--color-green-bright)' }}
          >
            {service.price_eur.toFixed(2)}€
          </span>
          <Link
            href={`/reservar?service=${service.id}`}
            className="label transition-colors duration-200 hover:text-white"
            style={{ color: 'var(--color-white-subtle)' }}
          >
            Reservar →
          </Link>
        </div>
      </div>
    </FadeIn>
  )
}

export function ServicesPreviewSection({ services }: ServicesPreviewSectionProps) {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="label block mb-4">Nuestros servicios</span>
              <h2 className="heading-lg">
                Hecho a tu<br />
                <em className="not-italic" style={{ color: 'var(--color-green-light)' }}>medida</em>
              </h2>
            </div>
            <Link href="/servicios" className="btn-outline self-start">
              Ver todos →
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
