import { createAdminClient } from '@/lib/supabase/server'
import { PaginaAdmin, DEFAULT_DAY } from '@/components/admin/pagina-admin'
import type { WeekSchedule } from '@/components/admin/pagina-admin'

const DEFAULT_INFO = {
  name:      'AG Beauty Salon',
  tagline:   'Elegancia clásica y estilo moderno en el corazón de Tarragona. Tu barbería premium de confianza.',
  address:   "Avinguda Principat d'Andorra, 10 A, 43002 Tarragona",
  phone:     '',
  instagram: 'agbeautysalon40',
  email:     '',
}

const DEFAULT_HOURS: WeekSchedule = {
  mon: { ...DEFAULT_DAY, open1: '09:00', close1: '19:00' },
  tue: { ...DEFAULT_DAY, open1: '09:00', close1: '19:00' },
  wed: { ...DEFAULT_DAY, open1: '09:00', close1: '19:00' },
  thu: { ...DEFAULT_DAY, open1: '09:00', close1: '19:00' },
  fri: { ...DEFAULT_DAY, open1: '09:00', close1: '19:00' },
  sat: { ...DEFAULT_DAY, open1: '09:00', close1: '14:00' },
  sun: { ...DEFAULT_DAY, mode: 'closed', open1: '09:00', close1: '14:00' },
}

export default async function PaginaPage() {
  const db = createAdminClient()

  const [{ data: infoRow }, { data: hoursRow }] = await Promise.all([
    db.from('settings').select('value').eq('key', 'business_info').single(),
    db.from('settings').select('value').eq('key', 'business_hours').single(),
  ])

  const savedInfo  = (infoRow?.value  as Record<string, string> | null) ?? {}
  const savedHours = (hoursRow?.value as Partial<WeekSchedule>  | null) ?? {}

  const info = { ...DEFAULT_INFO, ...savedInfo }

  const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
  const hours = Object.fromEntries(
    DAYS.map(day => [
      day,
      { ...DEFAULT_HOURS[day], ...(savedHours[day] ?? {}) },
    ])
  ) as WeekSchedule

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-10">
        <span className="label-sm block mb-2" style={{ color: 'var(--color-green-sage)' }}>Admin</span>
        <h1 className="font-serif text-3xl text-white">Página pública</h1>
        <p className="body-sm mt-2">Edita los textos, horario y datos de contacto que se muestran en la web.</p>
      </div>

      <PaginaAdmin info={info} hours={hours} />
    </div>
  )
}
