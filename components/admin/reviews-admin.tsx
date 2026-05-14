'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'

interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  service_name: string | null
  source: 'google' | 'booksy' | 'manual'
  visible: boolean
  created_at: string
}

const SOURCE_LABELS: Record<string, string> = {
  google:  'Google',
  booksy:  'Booksy',
  manual:  'Manual',
}

const SOURCE_COLORS: Record<string, string> = {
  google:  '#4285F4',
  booksy:  '#9B59B6',
  manual:  'var(--color-green-sage)',
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={16}
            className={n <= value ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#444]'}
          />
        </button>
      ))}
    </div>
  )
}

function AddReviewForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({
    customer_name: '',
    rating: 5,
    comment: '',
    service_name: '',
    source: 'google' as 'google' | 'booksy' | 'manual',
    visible: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.customer_name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json() as { success: boolean; error?: unknown }
      if (!json.success) throw new Error(String(json.error))
      onDone()
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="p-6 flex flex-col gap-4"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-green-mid)' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label className="label">Nombre del cliente *</label>
          <input
            className="input-dark"
            value={form.customer_name}
            onChange={(e) => set('customer_name', e.target.value)}
            placeholder="María García"
          />
        </div>

        {/* Fuente */}
        <div className="flex flex-col gap-1.5">
          <label className="label">Fuente *</label>
          <select
            className="input-dark"
            value={form.source}
            onChange={(e) => set('source', e.target.value as typeof form.source)}
          >
            <option value="google">Google</option>
            <option value="booksy">Booksy</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {/* Puntuación */}
        <div className="flex flex-col gap-1.5">
          <label className="label">Puntuación *</label>
          <StarRating value={form.rating} onChange={(v) => set('rating', v)} />
        </div>

        {/* Servicio */}
        <div className="flex flex-col gap-1.5">
          <label className="label">Servicio (opcional)</label>
          <input
            className="input-dark"
            value={form.service_name}
            onChange={(e) => set('service_name', e.target.value)}
            placeholder="Corte degradado"
          />
        </div>

        {/* Comentario */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="label">Comentario</label>
          <textarea
            className="input-dark resize-none"
            rows={3}
            value={form.comment}
            onChange={(e) => set('comment', e.target.value)}
            placeholder="Escribe la reseña..."
          />
        </div>

        {/* Visible */}
        <div className="flex items-center gap-3">
          <input
            id="visible"
            type="checkbox"
            checked={form.visible}
            onChange={(e) => set('visible', e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="visible" className="label cursor-pointer">Visible en la web</label>
        </div>
      </div>

      {error && <p className="label-sm" style={{ color: '#f87171' }}>{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving || !form.customer_name.trim()} className="btn-primary">
          {saving ? 'Guardando...' : 'Guardar reseña'}
        </button>
        <button type="button" onClick={onDone} className="btn-ghost">Cancelar</button>
      </div>
    </form>
  )
}

function ReviewRow({ review, onRefresh }: { review: Review; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false)

  async function toggleVisible() {
    setLoading(true)
    await fetch(`/api/reviews/${review.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !review.visible }),
    })
    onRefresh()
    setLoading(false)
  }

  async function remove() {
    if (!confirm('¿Eliminar esta reseña?')) return
    setLoading(true)
    await fetch(`/api/reviews/${review.id}`, { method: 'DELETE' })
    onRefresh()
    setLoading(false)
  }

  return (
    <div
      className="flex items-start gap-4 py-4 px-5"
      style={{
        borderBottom: '1px solid var(--color-surface-2)',
        opacity: review.visible ? 1 : 0.5,
      }}
    >
      {/* Source badge */}
      <span
        className="shrink-0 label-sm px-2 py-0.5 rounded-full mt-0.5"
        style={{
          fontSize: '10px',
          background: `${SOURCE_COLORS[review.source] ?? '#666'}22`,
          color: SOURCE_COLORS[review.source] ?? '#666',
          border: `1px solid ${SOURCE_COLORS[review.source] ?? '#666'}44`,
        }}
      >
        {SOURCE_LABELS[review.source] ?? review.source}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="body-sm" style={{ color: 'var(--color-white)' }}>{review.customer_name}</span>
          <StarRating value={review.rating} />
          {review.service_name && (
            <span className="label-sm" style={{ color: 'var(--color-white-muted)' }}>· {review.service_name}</span>
          )}
        </div>
        {review.comment && (
          <p className="label-sm line-clamp-2" style={{ color: 'var(--color-white-subtle)' }}>
            {review.comment}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={toggleVisible}
          disabled={loading}
          className="label-sm px-3 py-1"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-surface-3)',
            color: review.visible ? '#f87171' : 'var(--color-green-light)',
          }}
        >
          {review.visible ? 'Ocultar' : 'Mostrar'}
        </button>
        <button
          onClick={remove}
          disabled={loading}
          className="label-sm px-3 py-1"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-surface-3)',
            color: '#f87171',
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export function ReviewsAdmin({ initialReviews }: { initialReviews: Review[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [adding, setAdding] = useState(false)

  function refresh() {
    startTransition(() => router.refresh())
  }

  return (
    <div>
      {!adding && (
        <button onClick={() => setAdding(true)} className="btn-primary mb-6">
          + Añadir reseña
        </button>
      )}

      {adding && (
        <div className="mb-6">
          <AddReviewForm onDone={() => { setAdding(false); refresh() }} />
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-6 mb-6">
        {(['google', 'booksy', 'manual'] as const).map((src) => {
          const count = initialReviews.filter((r) => r.source === src).length
          return (
            <div key={src} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: SOURCE_COLORS[src] }}
              />
              <span className="label-sm">{SOURCE_LABELS[src]}: {count}</span>
            </div>
          )
        })}
        <span className="label-sm" style={{ color: 'var(--color-white-muted)' }}>
          Total: {initialReviews.length}
        </span>
      </div>

      {/* List */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}>
        {initialReviews.length === 0 ? (
          <div className="p-12 text-center">
            <p className="body-sm">No hay reseñas aún. Añade la primera.</p>
          </div>
        ) : (
          initialReviews.map((r) => (
            <ReviewRow key={r.id} review={r} onRefresh={refresh} />
          ))
        )}
      </div>
    </div>
  )
}
