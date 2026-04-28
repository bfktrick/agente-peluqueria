'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Service } from '@/lib/types'

interface ServiceFormData {
  name: string
  description: string
  duration_min: number
  price_eur: number
  active: boolean
  sort_order: number
}

const EMPTY_FORM: ServiceFormData = {
  name: '', description: '', duration_min: 30, price_eur: 0, active: true, sort_order: 0,
}

function ServiceForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial: ServiceFormData
  onSubmit: (d: ServiceFormData) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState(initial)

  function update<K extends keyof ServiceFormData>(k: K, v: ServiceFormData[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  return (
    <div
      className="p-6 flex flex-col gap-4"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-green-mid)' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="label">Nombre *</label>
          <input className="input-dark" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="label">Descripción</label>
          <textarea className="input-dark resize-none" rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Duración (min) *</label>
          <input className="input-dark" type="number" min="5" value={form.duration_min} onChange={(e) => update('duration_min', Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Precio (€) *</label>
          <input className="input-dark" type="number" min="0" step="0.5" value={form.price_eur} onChange={(e) => update('price_eur', Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Orden</label>
          <input className="input-dark" type="number" value={form.sort_order} onChange={(e) => update('sort_order', Number(e.target.value))} />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input id="active" type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} className="w-4 h-4" />
          <label htmlFor="active" className="label cursor-pointer">Activo (visible en web)</label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSubmit(form)}
          disabled={loading || !form.name}
          className="btn-primary"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button onClick={onCancel} className="btn-ghost">Cancelar</button>
      </div>
    </div>
  )
}

function ServiceRow({
  service,
  onEdit,
  onToggleActive,
}: {
  service: Service
  onEdit: (s: Service) => void
  onToggleActive: (s: Service) => void
}) {
  return (
    <div
      className="flex items-center gap-4 py-4 px-5 transition-colors duration-200"
      style={{
        borderBottom: '1px solid var(--color-surface-2)',
        opacity: service.active ? 1 : 0.5,
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <p className="body-sm" style={{ color: 'var(--color-white)' }}>{service.name}</p>
          {!service.active && (
            <span className="badge-muted">Inactivo</span>
          )}
        </div>
        {service.description && (
          <p className="label-sm mt-0.5 truncate">{service.description}</p>
        )}
      </div>
      <div className="flex items-center gap-6 shrink-0">
        <span className="badge-green">{service.duration_min}&apos;</span>
        <span
          className="font-serif text-lg"
          style={{ color: 'var(--color-green-bright)' }}
        >
          {service.price_eur.toFixed(2)}€
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(service)}
            className="label-sm px-3 py-1"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-surface-3)',
              color: 'var(--color-white-muted)',
            }}
          >
            Editar
          </button>
          <button
            onClick={() => onToggleActive(service)}
            className="label-sm px-3 py-1"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-surface-3)',
              color: service.active ? '#f87171' : 'var(--color-green-light)',
            }}
          >
            {service.active ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ServicesAdmin({ services }: { services: Service[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)

  async function handleCreate(data: ServiceFormData) {
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setCreating(false)
    startTransition(() => router.refresh())
  }

  async function handleEdit(data: ServiceFormData) {
    if (!editing) return
    await fetch(`/api/services/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setEditing(null)
    startTransition(() => router.refresh())
  }

  async function handleToggleActive(service: Service) {
    await fetch(`/api/services/${service.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !service.active }),
    })
    startTransition(() => router.refresh())
  }

  return (
    <div>
      {!creating && !editing && (
        <button onClick={() => setCreating(true)} className="btn-primary mb-6">
          + Nuevo servicio
        </button>
      )}

      {creating && (
        <div className="mb-6">
          <ServiceForm
            initial={EMPTY_FORM}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
            loading={isPending}
          />
        </div>
      )}

      <div
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
      >
        {services.map((s) => (
          editing?.id === s.id ? (
            <div key={s.id} className="p-4">
              <ServiceForm
                initial={{
                  name: s.name,
                  description: s.description ?? '',
                  duration_min: s.duration_min,
                  price_eur: s.price_eur,
                  active: s.active,
                  sort_order: s.sort_order,
                }}
                onSubmit={handleEdit}
                onCancel={() => setEditing(null)}
                loading={isPending}
              />
            </div>
          ) : (
            <ServiceRow
              key={s.id}
              service={s}
              onEdit={setEditing}
              onToggleActive={handleToggleActive}
            />
          )
        ))}

        {services.length === 0 && !creating && (
          <div className="p-12 text-center">
            <p className="body-sm">No hay servicios aún. Crea el primero.</p>
          </div>
        )}
      </div>
    </div>
  )
}
