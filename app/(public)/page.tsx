import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/public/hero-section'
import { ServicesPreviewSection } from '@/components/public/services-preview-section'
import { ExperienceSection } from '@/components/public/experience-section'
import { GallerySection } from '@/components/public/gallery-section'
import { TestimonialsSection } from '@/components/public/testimonials-section'
import { CTASection } from '@/components/public/cta-section'
import { Footer } from '@/components/public/footer'
import type { Service } from '@/lib/types'

export const metadata: Metadata = {
  title: 'AG Beauty Salon | Barbería en Tarragona',
  description:
    'Barbería y salón de belleza profesional en Tarragona. Cortes degradado, arreglo de barba y más. Reserva tu cita online.',
}

export default async function HomePage() {
  const db = createAdminClient()

  const [
    { data: servicesData },
    { data: expRow },
    { data: galRow },
    { data: reviewsData },
    { data: heroBgRow },
    { data: waRow },
    { data: infoRow },
    { data: hoursRow },
  ] = await Promise.all([
    db.from('services').select('*').eq('active', true).order('sort_order'),
    db.from('settings').select('value').eq('key', 'experience_image').single(),
    db.from('settings').select('value').eq('key', 'gallery_images').single(),
    db.from('reviews').select('*').eq('visible', true).order('created_at', { ascending: false }),
    db.from('settings').select('value').eq('key', 'hero_background').single(),
    db.from('settings').select('value').eq('key', 'whatsapp_number').single(),
    db.from('settings').select('value').eq('key', 'business_info').single(),
    db.from('settings').select('value').eq('key', 'business_hours').single(),
  ])

  const services: Service[] = servicesData ?? []
  const experienceUrl       = (expRow?.value as string | null) ?? undefined
  const galleryUrls         = (galRow?.value as string[] | null) ?? undefined
  const reviews             = reviewsData ?? []
  const avgRating           = reviews.length
    ? Math.round((reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 4.9
  const heroBgUrl           = (heroBgRow?.value as string | null) ?? undefined
  const whatsappNumber      = (waRow?.value as string | null) ?? ''

  const info = (infoRow?.value as Record<string, string> | null) ?? {}

  type DaySchedule = { mode: string; open1: string; close1: string; open2: string; close2: string }
  type WeekSchedule = Record<string, DaySchedule>
  const hrs = (hoursRow?.value as WeekSchedule | null) ?? {}

  const DAY_NAMES: Record<string, string> = {
    mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves',
    fri: 'Viernes', sat: 'Sábado', sun: 'Domingo',
  }

  function formatDay(day: DaySchedule | undefined, fallback: string): string {
    if (!day) return fallback
    if (day.mode === 'closed') return 'Cerrado'
    if (day.mode === 'split') return `${day.open1} – ${day.close1} / ${day.open2} – ${day.close2}`
    return `${day.open1} – ${day.close1}`
  }

  const scheduleLines = Object.entries(DAY_NAMES).map(([key, name]) => ({
    label: name,
    value: formatDay(hrs[key], key === 'sun' ? 'Cerrado' : '09:00 – 19:00'),
  }))

  return (
    <main>
      <HeroSection backgroundUrl={heroBgUrl} />
      <div className="relative" style={{ zIndex: 2 }}>
        <ServicesPreviewSection services={services} />
        <ExperienceSection imageUrl={experienceUrl} />
        <GallerySection images={galleryUrls} />
        <TestimonialsSection reviews={reviews} averageRating={avgRating} totalCount={reviews.length} />
        <CTASection whatsappNumber={whatsappNumber} />
        <Footer
          name={info.name}
          tagline={info.tagline}
          address={info.address}
          phone={info.phone}
          instagram={info.instagram}
          email={info.email}
          scheduleLines={scheduleLines}
        />
      </div>
    </main>
  )
}
