'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Spinner } from '@/components/ui/spinner'
import type { Service, TimeSlot } from '@/lib/types'

type Step = 'service' | 'datetime' | 'details' | 'confirm'

interface BookingState {
  serviceId: string
  date: string        // YYYY-MM-DD
  slot: TimeSlot | null
  name: string
  phone: string
  email: string
  notes: string
}

const STEPS: { id: Step; label: string }[] = [
  { id: 'service',  label: 'Servicio' },
  { id: 'datetime', label: 'Fecha' },
  { id: 'details',  label: 'Datos' },
  { id: 'confirm',  label: 'Confirmar' },
]

const TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current)
  return (
    <div className="flex items-center gap-3 mb-10">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-label transition-all duration-300"
              style={{
                background: i <= idx ? 'var(--color-green-mid)' : 'var(--color-surface-2)',
                color: i <= idx ? 'var(--color-white)' : 'var(--color-white-subtle)',
                border: i === idx ? '1px solid var(--color-green-sage)' : '1px solid transparent',
              }}
            >
              {i < idx ? '✓' : i + 1}
            </div>
            <span
              className="label-sm hidden sm:block"
              style={{ color: i <= idx ? 'var(--color-white-muted)' : 'var(--color-white-subtle)' }}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="w-8 h-px mb-5 hidden sm:block transition-colors duration-300"
              style={{ background: i < idx ? 'var(--color-green-mid)' : 'var(--color-surface-3)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 1: Service selection ──────────────────────────────────────────────
function ServiceStep({
  services,
  selected,
  onSelect,
}: {
  services: Service[]
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {services.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className="text-left p-6 transition-all duration-300 focus:outline-none"
          style={{
            background: selected === s.id ? 'var(--color-green-deep)' : 'var(--color-surface)',
            border: selected === s.id
              ? '1px solid var(--color-green-sage)'
              : '1px solid var(--color-surface-2)',
            boxShadow: selected === s.id ? 'var(--shadow-green-glow-sm)' : 'none',
          }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="font-serif text-lg text-white">{s.name}</p>
            <span
              className="font-label text-[10px] tracking-wider uppercase shrink-0 px-2 py-0.5"
              style={{
                background: 'var(--color-green-forest)',
                color: 'var(--color-green-light)',
              }}
            >
              {s.duration_min}&apos;
            </span>
          </div>
          {s.description && (
            <p className="body-sm mb-3">{s.description}</p>
          )}
          <p
            className="font-serif text-xl"
            style={{ color: 'var(--color-green-bright)' }}
          >
            {s.price_eur.toFixed(2)}€
          </p>
        </button>
      ))}
    </div>
  )
}

// ── Step 2: Date + Time ────────────────────────────────────────────────────
function DateTimeStep({
  serviceId,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotSelect,
}: {
  serviceId: string
  selectedDate: string
  selectedSlot: TimeSlot | null
  onDateChange: (d: string) => void
  onSlotSelect: (s: TimeSlot) => void
}) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  // Generate next 30 available date strings
  const today = new Date()
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d.toISOString().split('T')[0]!
  })

  const fetchSlots = useCallback(async (date: string) => {
    setLoading(true)
    setSlots([])
    try {
      const res = await fetch(`/api/slots?date=${date}&service_id=${serviceId}`)
      const json = await res.json() as { success: boolean; data: TimeSlot[] }
      if (json.success) setSlots(json.data)
    } finally {
      setLoading(false)
    }
  }, [serviceId])

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate)
  }, [selectedDate, fetchSlots])

  const availableSlots = slots.filter((s) => s.available)

  return (
    <div className="flex flex-col gap-8">
      {/* Date picker */}
      <div>
        <p className="label mb-4">Selecciona el día</p>
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
          {dates.map((d) => {
            const dt = new Date(d + 'T00:00:00')
            const dayName = dt.toLocaleDateString('es-ES', { weekday: 'short' })
            const dayNum  = dt.getDate()
            const isSelected = d === selectedDate
            return (
              <button
                key={d}
                onClick={() => onDateChange(d)}
                className="flex flex-col items-center py-3 px-1 transition-all duration-200 focus:outline-none"
                style={{
                  background: isSelected ? 'var(--color-green-mid)' : 'var(--color-surface)',
                  border: isSelected
                    ? '1px solid var(--color-green-sage)'
                    : '1px solid var(--color-surface-2)',
                }}
              >
                <span
                  className="label-sm"
                  style={{ color: isSelected ? 'var(--color-green-light)' : 'var(--color-white-subtle)' }}
                >
                  {dayName}
                </span>
                <span
                  className="font-serif text-lg mt-1"
                  style={{ color: isSelected ? 'var(--color-white)' : 'var(--color-white-muted)' }}
                >
                  {dayNum}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="label mb-4">
            Horarios disponibles
            {loading && <Spinner size="sm" className="inline ml-3" />}
          </p>
          {!loading && availableSlots.length === 0 && (
            <p className="body-sm" style={{ color: 'var(--color-white-subtle)' }}>
              No hay huecos disponibles este día. Prueba con otra fecha.
            </p>
          )}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {availableSlots.map((slot) => {
              const isSelected = selectedSlot?.datetime === slot.datetime
              return (
                <button
                  key={slot.datetime}
                  onClick={() => onSlotSelect(slot)}
                  className="py-2.5 text-center transition-all duration-200 focus:outline-none"
                  style={{
                    background: isSelected ? 'var(--color-green-mid)' : 'var(--color-surface)',
                    border: isSelected
                      ? '1px solid var(--color-green-sage)'
                      : '1px solid var(--color-surface-2)',
                    color: isSelected ? 'var(--color-white)' : 'var(--color-white-muted)',
                  }}
                >
                  <span className="font-label text-xs">{slot.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Step 3: Personal details ───────────────────────────────────────────────
function DetailsStep({
  state,
  onChange,
}: {
  state: BookingState
  onChange: (k: keyof BookingState, v: string) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label className="label" htmlFor="name">Nombre *</label>
        <input
          id="name"
          className="input-dark"
          placeholder="Tu nombre completo"
          value={state.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="label" htmlFor="phone">Teléfono *</label>
        <input
          id="phone"
          className="input-dark"
          placeholder="+34 600 000 000"
          type="tel"
          value={state.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="label" htmlFor="email">Email (opcional)</label>
        <input
          id="email"
          className="input-dark"
          placeholder="para recibir confirmación"
          type="email"
          value={state.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="label" htmlFor="notes">Notas (opcional)</label>
        <textarea
          id="notes"
          className="input-dark resize-none"
          placeholder="Alguna indicación especial..."
          rows={3}
          value={state.notes}
          onChange={(e) => onChange('notes', e.target.value)}
        />
      </div>
    </div>
  )
}

// ── Step 4: Confirmation summary ───────────────────────────────────────────
function ConfirmStep({
  state,
  service,
}: {
  state: BookingState
  service: Service | undefined
}) {
  const date = state.slot
    ? new Date(state.slot.datetime).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : ''

  return (
    <div
      className="p-8 flex flex-col gap-5"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-green-mid)' }}
    >
      <h3 className="heading-sm">Resumen de tu reserva</h3>
      <div className="divider-green" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="label-sm block mb-1">Servicio</span>
          <p className="body-sm" style={{ color: 'var(--color-white)' }}>{service?.name}</p>
        </div>
        <div>
          <span className="label-sm block mb-1">Precio</span>
          <p className="font-serif text-xl" style={{ color: 'var(--color-green-bright)' }}>
            {service?.price_eur.toFixed(2)}€
          </p>
        </div>
        <div>
          <span className="label-sm block mb-1">Fecha</span>
          <p className="body-sm" style={{ color: 'var(--color-white)' }}>{date}</p>
        </div>
        <div>
          <span className="label-sm block mb-1">Hora</span>
          <p className="body-sm" style={{ color: 'var(--color-white)' }}>{state.slot?.label}</p>
        </div>
        <div>
          <span className="label-sm block mb-1">Nombre</span>
          <p className="body-sm" style={{ color: 'var(--color-white)' }}>{state.name}</p>
        </div>
        <div>
          <span className="label-sm block mb-1">Teléfono</span>
          <p className="body-sm" style={{ color: 'var(--color-white)' }}>{state.phone}</p>
        </div>
        {state.email && (
          <div className="col-span-2">
            <span className="label-sm block mb-1">Email</span>
            <p className="body-sm" style={{ color: 'var(--color-white)' }}>{state.email}</p>
          </div>
        )}
        {state.notes && (
          <div className="col-span-2">
            <span className="label-sm block mb-1">Notas</span>
            <p className="body-sm" style={{ color: 'var(--color-white)' }}>{state.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main BookingForm ───────────────────────────────────────────────────────
export function BookingForm({
  services,
  preselectedServiceId,
}: {
  services: Service[]
  preselectedServiceId?: string
}) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('service')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [state, setState] = useState<BookingState>({
    serviceId: preselectedServiceId ?? '',
    date: '',
    slot: null,
    name: '',
    phone: '',
    email: '',
    notes: '',
  })

  const selectedService = services.find((s) => s.id === state.serviceId)

  function updateState(key: keyof BookingState, value: string) {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  // Validation per step
  const canProceed: Record<Step, boolean> = {
    service:  !!state.serviceId,
    datetime: !!state.date && !!state.slot,
    details:  state.name.trim().length >= 2 && state.phone.trim().length >= 7,
    confirm:  true,
  }

  function goNext() {
    const order: Step[] = ['service', 'datetime', 'details', 'confirm']
    const idx = order.indexOf(step)
    if (idx < order.length - 1) setStep(order[idx + 1]!)
  }

  function goPrev() {
    const order: Step[] = ['service', 'datetime', 'details', 'confirm']
    const idx = order.indexOf(step)
    if (idx > 0) setStep(order[idx - 1]!)
  }

  async function handleSubmit() {
    if (!state.slot) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name:  state.name,
          customer_phone: state.phone,
          customer_email: state.email || undefined,
          service_id:     state.serviceId,
          scheduled_at:   state.slot.datetime,
          notes:          state.notes || undefined,
          channel:        'web',
        }),
      })

      const json = await res.json() as { success: boolean; error?: { message: string } }

      if (!json.success) {
        setError(json.error?.message ?? 'Error al reservar. Inténtalo de nuevo.')
        return
      }

      router.push('/reservar/exito')
    } catch {
      setError('Error de red. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const stepContent: Record<Step, React.ReactNode> = {
    service: (
      <ServiceStep
        services={services}
        selected={state.serviceId}
        onSelect={(id) => updateState('serviceId', id)}
      />
    ),
    datetime: (
      <DateTimeStep
        serviceId={state.serviceId}
        selectedDate={state.date}
        selectedSlot={state.slot}
        onDateChange={(d) => setState((p) => ({ ...p, date: d, slot: null }))}
        onSlotSelect={(s) => setState((p) => ({ ...p, slot: s }))}
      />
    ),
    details: <DetailsStep state={state} onChange={updateState} />,
    confirm: <ConfirmStep state={state} service={selectedService} />,
  }

  return (
    <div
      className="p-8 sm:p-10"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
    >
      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={TRANSITION}
        >
          {stepContent[step]}
        </motion.div>
      </AnimatePresence>

      {error && (
        <p className="body-sm mt-6" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: '1px solid var(--color-surface-3)' }}>
        <button
          onClick={goPrev}
          className="btn-ghost"
          disabled={step === 'service'}
          style={{ opacity: step === 'service' ? 0 : 1 }}
        >
          ← Atrás
        </button>

        {step !== 'confirm' ? (
          <button
            onClick={goNext}
            className="btn-primary"
            disabled={!canProceed[step]}
            style={{ opacity: canProceed[step] ? 1 : 0.4 }}
          >
            Continuar →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                Reservando...
              </span>
            ) : (
              'Confirmar reserva'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
