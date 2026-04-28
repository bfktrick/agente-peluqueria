import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/public/hero-section'
import { ServicesPreviewSection } from '@/components/public/services-preview-section'
import { ContactSection } from '@/components/public/contact-section'
import type { Service } from '@/lib/types'

export const metadata: Metadata = {
  title: 'AG Beauty Salon | Barbería en Tarragona',
  description:
    'Barbería y salón de belleza profesional en Tarragona. Cortes degradado, arreglo de barba y más. Reserva tu cita online.',
}

export default async function HomePage() {
  const db = createAdminClient()
  const { data } = await db
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order')
    .limit(3)

  const services: Service[] = data ?? []

  return (
    <main>
      <HeroSection />
      <ServicesPreviewSection services={services} />
      <ContactSection />
    </main>
  )
}
