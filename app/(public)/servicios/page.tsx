import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { Footer } from '@/components/public/footer'
import { ServiciosCatalog } from '@/components/public/servicios-catalog'
import type { Service } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Cortes, barba, color, uñas, estética y más. Consulta todos los servicios de AG Beauty Salon en Tarragona.',
  openGraph: {
    title: 'Servicios | AG Beauty Salon',
    description: 'Todos los servicios de barbería y estética en Tarragona.',
    url: 'https://agbeautysalon.com/servicios',
  },
  alternates: { canonical: '/servicios' },
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
    <>
      <main className="pt-28 pb-0 min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <div className="section-pad pt-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-16">
              <span className="overline block mb-4">AG Beauty Salon</span>
              <h1 className="h-display mb-4">
                Nuestros<br />
                <em className="not-italic" style={{ color: 'var(--color-gold)' }}>
                  servicios
                </em>
              </h1>
              <div className="divider-gold" style={{ maxWidth: '200px' }} />
            </div>

            {/* Tabs + Grid (client component) */}
            {services.length === 0 ? (
              <p className="body-copy text-center py-20">Próximamente. Vuelve en breve.</p>
            ) : (
              <ServiciosCatalog services={services} />
            )}

            {/* Bottom CTA */}
            <div className="mt-20 text-center">
              <p className="body-copy mb-6">¿No encuentras lo que buscas? Contáctanos directamente.</p>
              <Link href="/reservar" className="btn-gold">Reservar cita online</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
