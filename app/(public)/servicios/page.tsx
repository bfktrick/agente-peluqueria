import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { FadeIn } from '@/components/ui/fade-in'
import type { Service } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Cortes degradado, arreglo de barba, diseños y más. Consulta todos los servicios de AG Beauty Salon en Tarragona.',
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <FadeIn delay={index * 0.07} direction="up">
      <article className="card-dark-hover p-8 flex flex-col gap-4 h-full">
        <div className="flex items-start justify-between gap-4">
          <h3 className="heading-sm">{service.name}</h3>
          <span className="badge-green shrink-0">{service.duration_min}&apos;</span>
        </div>

        {service.description && (
          <p className="body-sm flex-1">{service.description}</p>
        )}

        <div
          className="flex items-center justify-between pt-5 mt-auto"
          style={{ borderTop: '1px solid var(--color-surface-3)' }}
        >
          <span
            className="font-serif text-3xl font-normal"
            style={{ color: 'var(--color-green-bright)' }}
          >
            {service.price_eur.toFixed(2)}
            <span className="text-base ml-0.5" style={{ color: 'var(--color-white-muted)' }}>€</span>
          </span>
          <Link
            href={`/reservar?service=${service.id}`}
            className="btn-primary text-[10px] px-5 py-2.5"
          >
            Reservar
          </Link>
        </div>
      </article>
    </FadeIn>
  )
}

export default async function ServiciosPage() {
  const db = createAdminClient()
  const { data } = await db
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  const services: Service[] = data ?? []

  return (
    <main className="pt-24 pb-28 px-6 min-h-screen" style={{ background: 'var(--color-black)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn direction="up">
          <div className="mb-16">
            <span className="label block mb-4">AG Beauty Salon</span>
            <h1 className="heading-xl mb-6">
              Servicios
            </h1>
            <div className="divider-green" style={{ maxWidth: '200px' }} />
          </div>
        </FadeIn>

        {/* Grid */}
        {services.length === 0 ? (
          <FadeIn>
            <p className="body text-center py-20">
              Próximamente. Vuelve en breve.
            </p>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <FadeIn delay={0.3} direction="up">
          <div className="mt-20 text-center">
            <p className="body mb-6">
              ¿No encuentras lo que buscas? Contáctanos directamente.
            </p>
            <Link href="/reservar" className="btn-primary">
              Reservar cita online
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  )
}
