'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import type { Appointment } from '@/lib/types'

const CHANNEL_LABELS: Record<Appointment['channel'], string> = {
  web:      'Web',
  voice:    'Voz',
  whatsapp: 'WhatsApp',
  email:    'Email',
}

const STATUS_BADGE: Record<Appointment['status'], 'pending' | 'confirmed' | 'cancelled' | 'completed'> = {
  pending:   'pending',
  confirmed: 'confirmed',
  cancelled: 'cancelled',
  completed: 'completed',
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [localStatus, setLocalStatus] = useState(appointment.status)

  async function changeStatus(status: 'confirmed' | 'cancelled' | 'completed') {
    setLocalStatus(status)

    const res = await fetch(`/api/appointments/${appointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      setLocalStatus(appointment.status) // rollback
      return
    }

    startTransition(() => { router.refresh() })
  }

  const date = new Date(appointment.scheduled_at).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <tr style={{ borderBottom: '1px solid var(--color-surface-2)' }}>
      <td className="py-4 px-4">
        <p className="body-sm" style={{ color: 'var(--color-white)' }}>{appointment.customer_name}</p>
        <p className="label-sm">{appointment.customer_phone}</p>
      </td>
      <td className="py-4 px-4">
        <p className="body-sm" style={{ color: 'var(--color-white-muted)' }}>
          {appointment.service?.name ?? '—'}
        </p>
      </td>
      <td className="py-4 px-4">
        <p className="body-sm" style={{ color: 'var(--color-white-muted)' }}>{date}</p>
      </td>
      <td className="py-4 px-4">
        <Badge variant={STATUS_BADGE[localStatus]}>
          {localStatus === 'pending'   && 'Pendiente'}
          {localStatus === 'confirmed' && 'Confirmada'}
          {localStatus === 'cancelled' && 'Cancelada'}
          {localStatus === 'completed' && 'Completada'}
        </Badge>
      </td>
      <td className="py-4 px-4">
        <span className="badge-muted">{CHANNEL_LABELS[appointment.channel]}</span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {isPending && <Spinner size="sm" />}
          {localStatus === 'pending' && (
            <>
              <button
                onClick={() => changeStatus('confirmed')}
                disabled={isPending}
                className="label-sm px-3 py-1 transition-colors duration-200"
                style={{
                  background: 'var(--color-green-deep)',
                  border: '1px solid var(--color-green-mid)',
                  color: 'var(--color-green-light)',
                }}
              >
                Confirmar
              </button>
              <button
                onClick={() => changeStatus('cancelled')}
                disabled={isPending}
                className="label-sm px-3 py-1 transition-colors duration-200"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-surface-3)',
                  color: 'var(--color-white-subtle)',
                }}
              >
                Cancelar
              </button>
            </>
          )}
          {localStatus === 'confirmed' && (
            <>
              <button
                onClick={() => changeStatus('completed')}
                disabled={isPending}
                className="label-sm px-3 py-1 transition-colors duration-200"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-surface-3)',
                  color: 'var(--color-white-subtle)',
                }}
              >
                Completar
              </button>
              <button
                onClick={() => changeStatus('cancelled')}
                disabled={isPending}
                className="label-sm px-3 py-1 transition-colors duration-200"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid #6b2828',
                  color: '#f87171',
                }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export function AppointmentsTable({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return (
      <div
        className="p-12 text-center"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
      >
        <p className="heading-sm mb-2">Sin citas</p>
        <p className="body-sm">No hay citas para este filtro.</p>
      </div>
    )
  }

  return (
    <div
      className="overflow-x-auto"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-surface-3)' }}>
            {['Cliente', 'Servicio', 'Fecha', 'Estado', 'Canal', 'Acciones'].map((h) => (
              <th key={h} className="text-left py-3 px-4">
                <span className="label">{h}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <AppointmentRow key={apt.id} appointment={apt} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
