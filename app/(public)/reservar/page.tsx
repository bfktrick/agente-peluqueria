import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/public/booking-form'
import { FadeIn } from '@/components/ui/fade-in'
import type { Service } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Reservar cita',
  description: 'Reserva tu cita en AG Beauty Salon. Elige tu servicio, fecha y hora en segundos.',
}

export default async function ReservarPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const params = await searchParams
  const db = createAdminClient()
  const { data } = await db
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  const services: Service[] = data ?? []

  return (
    <main className="pt-24 pb-28 px-6 min-h-screen" style={{ background: 'var(--color-black)' }}>
      <div className="max-w-3xl mx-auto">
        <FadeIn direction="up">
          <div className="mb-12">
            <span className="label block mb-4">AG Beauty Salon</span>
            <h1 className="heading-lg">Reservar cita</h1>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.1}>
          <BookingForm
            services={services}
            {...(params.service ? { preselectedServiceId: params.service } : {})}
          />
        </FadeIn>
      </div>
    </main>
  )
}
