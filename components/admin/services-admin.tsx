'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SERVICE_CATEGORIES } from '@/lib/types'
import type { Service } from '@/lib/types'

interface ServiceFormData {
  name: string
  description: string
  duration_min: number
  price_eur: number
  image_url: string
  active: boolean
  sort_order: number
  category: string
}

const EMPTY_FORM: ServiceFormData = {
  name: '', description: '', duration_min: 30, price_eur: 0, image_url: '', active: true, sort_order: 0, category: '',
}

function ImageUploadField({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploading(true)

    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json() as { success: boolean; url?: string; error?: string }
      if (!json.success) {
        setUploadError(json.error ?? 'Error al subir')
      } else {
        onChange(json.url ?? '')
      }
    } catch {
      setUploadError('Error de red al subir la imagen')
    } finally {
      setUploading(false)
      // reset file input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="sm:col-span-2 flex flex-col gap-1.5">
      <label className="label">Foto del servicio</label>
      <div className="flex gap-4 items-start">
        {/* Preview */}
        <div
          className="shrink-0 w-24 h-24 overflow-hidden flex items-center justify-center"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-surface-3)',
            borderRadius: '8px',
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <span className="label-sm" style={{ color: 'var(--color-white-subtle)' }}>Sin foto</span>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-ghost text-left"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            {uploading ? 'Subiendo...' : value ? 'Cambiar foto' : 'Subir foto'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="label-sm text-left"
              style={{ color: '#f87171', padding: '0 12px' }}
            >
              Quitar foto
            </button>
          )}
          <p className="label-sm" style={{ color: 'var(--color-white-subtle)', paddingLeft: '12px' }}>
            JPG, PNG o WEBP · máx. 3 MB
          </p>
          {uploadError && (
            <p className="label-sm" style={{ color: '#f87171', paddingLeft: '12px' }}>{uploadError}</p>
          )}
        </div>
      </div>
    </div>
  )
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

        <ImageUploadField value={form.image_url} onChange={(url) => update('image_url', url)} />

        <div className="flex flex-col gap-1.5">
          <label className="label">Duración (min) *</label>
          <input className="input-dark" type="number" min="5" value={form.duration_min} onChange={(e) => update('duration_min', Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Precio (€) *</label>
          <input className="input-dark" type="number" min="0" step="0.5" value={form.price_eur} onChange={(e) => update('price_eur', Number(e.target.value))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Categoría *</label>
          <select
            className="input-dark"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          >
            <option value="">— Sin categoría —</option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
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
      {/* Thumbnail */}
      <div
        className="shrink-0 w-12 h-12 overflow-hidden"
        style={{
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-surface-3)',
          borderRadius: '6px',
        }}
      >
        {service.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="label-sm" style={{ color: 'var(--color-white-subtle)', fontSize: '18px' }}>✂</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="body-sm" style={{ color: 'var(--color-white)' }}>{service.name}</p>
          {service.category && (
            <span className="badge-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {SERVICE_CATEGORIES.find((c) => c.value === service.category)?.label ?? service.category}
            </span>
          )}
          {!service.active && (
            <span className="badge-muted" style={{ color: '#f87171' }}>Inactivo</span>
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
      body: JSON.stringify({
        ...data,
        ...(data.image_url ? { image_url: data.image_url } : {}),
      }),
    })
    setCreating(false)
    startTransition(() => router.refresh())
  }

  async function handleEdit(data: ServiceFormData) {
    if (!editing) return
    await fetch(`/api/services/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        image_url: data.image_url || null,
      }),
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
                  image_url: s.image_url ?? '',
                  active: s.active,
                  sort_order: s.sort_order,
                  category: s.category ?? '',
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
