'use client'

import { useState } from 'react'

/* ── Types ── */

interface BusinessInfo {
  name:      string
  tagline:   string
  address:   string
  phone:     string
  instagram: string
  email:     string
}

type DayMode = 'closed' | 'open' | 'split'

interface DaySchedule {
  mode:   DayMode
  open1:  string
  close1: string
  open2:  string
  close2: string
}

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

type WeekSchedule = Record<DayKey, DaySchedule>

interface Props {
  info:  BusinessInfo
  hours: WeekSchedule
}

const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
  sun: 'Domingo',
}

const DAYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const DEFAULT_DAY: DaySchedule = { mode: 'open', open1: '09:00', close1: '19:00', open2: '16:00', close2: '20:00' }

/* ── Helpers ── */

async function saveSetting(key: string, value: unknown) {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  })
  const json = await res.json() as { success: boolean; error?: string }
  if (!json.success) throw new Error(json.error ?? 'Error al guardar')
}

/* ── ModeButton ── */

function ModeBtn({
  active, label, onClick,
}: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1 text-xs transition-all duration-150"
      style={{
        background:  active ? 'var(--color-green-mid)' : 'var(--color-surface-2)',
        color:       active ? '#fff' : 'var(--color-white-muted)',
        border:      active ? '1px solid var(--color-green-sage)' : '1px solid var(--color-surface-3)',
        fontFamily:  'var(--font-label)',
        letterSpacing: '0.1em',
      }}
    >
      {label}
    </button>
  )
}

/* ── TimeInput ── */

function TimeInput({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <span style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-white-subtle)', fontFamily: 'var(--font-label)' }}>
        {label}
      </span>
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-dark"
        style={{ minWidth: 90, padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
      />
    </div>
  )
}

/* ── DayRow ── */

function DayRow({
  dayKey, schedule, onChange,
}: { dayKey: DayKey; schedule: DaySchedule; onChange: (d: DaySchedule) => void }) {
  const set = (patch: Partial<DaySchedule>) => onChange({ ...schedule, ...patch })

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-start gap-4 py-4"
      style={{ borderBottom: '1px solid var(--color-surface-2)' }}
    >
      {/* Day name */}
      <span
        className="shrink-0 text-white"
        style={{ minWidth: 88, fontFamily: 'var(--font-sans)', fontSize: '0.85rem', paddingTop: '0.35rem' }}
      >
        {DAY_LABELS[dayKey]}
      </span>

      {/* Mode selector */}
      <div className="flex gap-1.5 shrink-0">
        <ModeBtn active={schedule.mode === 'closed'} label="Cerrado"  onClick={() => set({ mode: 'closed' })} />
        <ModeBtn active={schedule.mode === 'open'}   label="Corrido"  onClick={() => set({ mode: 'open'   })} />
        <ModeBtn active={schedule.mode === 'split'}  label="Partido"  onClick={() => set({ mode: 'split'  })} />
      </div>

      {/* Time inputs */}
      {schedule.mode === 'open' && (
        <div className="flex items-end gap-2">
          <TimeInput label="Apertura" value={schedule.open1}  onChange={v => set({ open1: v })}  />
          <span style={{ color: 'var(--color-white-subtle)', paddingBottom: '0.5rem' }}>→</span>
          <TimeInput label="Cierre"   value={schedule.close1} onChange={v => set({ close1: v })} />
        </div>
      )}

      {schedule.mode === 'split' && (
        <div className="flex flex-wrap items-end gap-2">
          <TimeInput label="Mañana apertura" value={schedule.open1}  onChange={v => set({ open1: v })}  />
          <span style={{ color: 'var(--color-white-subtle)', paddingBottom: '0.5rem' }}>→</span>
          <TimeInput label="Mañana cierre"   value={schedule.close1} onChange={v => set({ close1: v })} />
          <span style={{ color: 'var(--color-surface-3)', paddingBottom: '0.5rem', fontSize: '1.1rem' }}>|</span>
          <TimeInput label="Tarde apertura"  value={schedule.open2}  onChange={v => set({ open2: v })}  />
          <span style={{ color: 'var(--color-white-subtle)', paddingBottom: '0.5rem' }}>→</span>
          <TimeInput label="Tarde cierre"    value={schedule.close2} onChange={v => set({ close2: v })} />
        </div>
      )}

      {schedule.mode === 'closed' && (
        <span style={{ color: 'var(--color-white-subtle)', fontSize: '0.8rem', paddingTop: '0.35rem' }}>
          No abre este día
        </span>
      )}
    </div>
  )
}

/* ── HorarioForm ── */

function HorarioForm({ initial }: { initial: WeekSchedule }) {
  const [schedule, setSchedule] = useState<WeekSchedule>(initial)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const updateDay = (day: DayKey) => (d: DaySchedule) => {
    setSchedule(s => ({ ...s, [day]: d }))
    setSaved(false)
  }

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await saveSetting('business_hours', schedule)
      setSaved(true)
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handle} className="flex flex-col gap-5">
      <div
        className="px-6 pt-2 pb-4"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
      >
        {DAYS.map(day => (
          <DayRow
            key={day}
            dayKey={day}
            schedule={schedule[day]}
            onChange={updateDay(day)}
          />
        ))}
      </div>

      {error && <p className="label-sm" style={{ color: '#f87171' }}>{error}</p>}
      {saved && <p className="label-sm" style={{ color: 'var(--color-green-bright)' }}>✓ Horario guardado.</p>}
      <button type="submit" disabled={saving} className="btn-primary self-start">
        {saving ? 'Guardando...' : 'Guardar horario'}
      </button>
    </form>
  )
}

/* ── TextosForm ── */

function TextosForm({ initial }: { initial: BusinessInfo }) {
  const [form, setForm]     = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const set = (k: keyof BusinessInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(f => ({ ...f, [k]: e.target.value }))
      setSaved(false)
    }

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    try {
      await saveSetting('business_info', form)
      setSaved(true)
    } catch (err) { setError(String(err))
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handle} className="flex flex-col gap-5">
      <div className="p-6 flex flex-col gap-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}>
        <div className="flex flex-col gap-1.5">
          <label className="label">Nombre del salón</label>
          <input className="input-dark" value={form.name} onChange={set('name')} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Descripción / Tagline (aparece en el footer)</label>
          <textarea className="input-dark resize-none" rows={3} value={form.tagline} onChange={set('tagline')} style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }} />
        </div>
      </div>
      {error && <p className="label-sm" style={{ color: '#f87171' }}>{error}</p>}
      {saved && <p className="label-sm" style={{ color: 'var(--color-green-bright)' }}>✓ Guardado correctamente.</p>}
      <button type="submit" disabled={saving} className="btn-primary self-start">{saving ? 'Guardando...' : 'Guardar textos'}</button>
    </form>
  )
}

/* ── ContactoForm ── */

function ContactoForm({ initial }: { initial: BusinessInfo }) {
  const [form, setForm]     = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const set = (k: keyof BusinessInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    setSaved(false)
  }

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    try {
      await saveSetting('business_info', form)
      setSaved(true)
    } catch (err) { setError(String(err))
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handle} className="flex flex-col gap-5">
      <div className="p-6 flex flex-col gap-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}>
        <div className="flex flex-col gap-1.5">
          <label className="label">Dirección</label>
          <input className="input-dark" value={form.address} onChange={set('address')} placeholder="Avinguda Principat d'Andorra, 10 A" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Teléfono</label>
          <input className="input-dark" type="tel" value={form.phone} onChange={set('phone')} placeholder="+34 600 000 000" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Instagram (usuario sin @)</label>
          <input className="input-dark" value={form.instagram} onChange={set('instagram')} placeholder="agbeautysalon40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Email de contacto</label>
          <input className="input-dark" type="email" value={form.email} onChange={set('email')} placeholder="info@agbeauty.com" />
        </div>
      </div>
      {error && <p className="label-sm" style={{ color: '#f87171' }}>{error}</p>}
      {saved && <p className="label-sm" style={{ color: 'var(--color-green-bright)' }}>✓ Contacto guardado.</p>}
      <button type="submit" disabled={saving} className="btn-primary self-start">{saving ? 'Guardando...' : 'Guardar contacto'}</button>
    </form>
  )
}

/* ── Root ── */

export function PaginaAdmin({ info, hours }: Props) {
  return (
    <div className="flex flex-col gap-14">
      <div>
        <h2 className="font-serif text-xl text-white mb-5">Textos de la página</h2>
        <TextosForm initial={info} />
      </div>

      <div className="h-px" style={{ background: 'var(--color-surface-2)' }} />

      <div>
        <h2 className="font-serif text-xl text-white mb-2">Horario</h2>
        <p className="body-sm mb-5">Elige para cada día si está cerrado, abre de corrido o con horario partido (mañana y tarde).</p>
        <HorarioForm initial={hours} />
      </div>

      <div className="h-px" style={{ background: 'var(--color-surface-2)' }} />

      <div>
        <h2 className="font-serif text-xl text-white mb-5">Contacto</h2>
        <ContactoForm initial={info} />
      </div>
    </div>
  )
}

export type { WeekSchedule, DaySchedule, DayKey }
export { DEFAULT_DAY }
