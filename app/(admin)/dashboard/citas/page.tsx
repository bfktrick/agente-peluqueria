import { AppointmentRepository } from '@/lib/repositories/appointment-repository'
import { AppointmentsTable } from '@/components/admin/appointments-table'

interface CitasPageProps {
  searchParams: Promise<{ status?: string }>
}

const STATUS_TABS = [
  { id: '',           label: 'Todas'      },
  { id: 'pending',    label: 'Pendientes' },
  { id: 'confirmed',  label: 'Confirmadas' },
  { id: 'completed',  label: 'Completadas' },
  { id: 'cancelled',  label: 'Canceladas' },
]

export default async function CitasPage({ searchParams }: CitasPageProps) {
  const { status } = await searchParams
  const repo = new AppointmentRepository()
  const appointments = await repo.findAll(status ? { status } : undefined)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="heading-md mb-1">Citas</h1>
        <p className="body-sm">Gestiona las reservas del salón</p>
      </div>

      {/* Status tabs */}
      <div
        className="flex gap-1 mb-6 p-1 w-fit"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
      >
        {STATUS_TABS.map((tab) => {
          const isActive = (status ?? '') === tab.id
          return (
            <a
              key={tab.id}
              href={tab.id ? `/dashboard/citas?status=${tab.id}` : '/dashboard/citas'}
              className="px-4 py-2 label text-xs transition-all duration-200"
              style={{
                background: isActive ? 'var(--color-green-mid)' : 'transparent',
                color: isActive ? 'var(--color-white)' : 'var(--color-white-subtle)',
              }}
            >
              {tab.label}
            </a>
          )
        })}
      </div>

      <AppointmentsTable appointments={appointments} />
    </div>
  )
}
