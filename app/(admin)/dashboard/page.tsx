import { createAdminClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const db = createAdminClient()

  const [{ count: pending }, { count: today }, { count: total }] = await Promise.all([
    db.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('appointments').select('*', { count: 'exact', head: true })
      .gte('scheduled_at', new Date().toISOString().split('T')[0]!)
      .lt('scheduled_at', new Date(Date.now() + 86400000).toISOString().split('T')[0]!),
    db.from('appointments').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Pendientes',     value: pending ?? 0 },
    { label: 'Citas hoy',      value: today ?? 0 },
    { label: 'Total citas',    value: total ?? 0 },
  ]

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="heading-md mb-1">Resumen</h1>
        <p className="body-sm">Panel de control de AG Beauty Salon</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-6"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
          >
            <p className="label mb-3">{s.label}</p>
            <p
              className="font-serif text-5xl"
              style={{ color: 'var(--color-green-bright)' }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
