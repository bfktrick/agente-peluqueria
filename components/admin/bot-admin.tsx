'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function BotAdmin({ whatsappNumber }: { whatsappNumber: string }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [number, setNumber] = useState(whatsappNumber)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'whatsapp_number', value: number.trim() }),
      })
      const json = await res.json() as { success: boolean; error?: string }
      if (!json.success) throw new Error(json.error ?? 'Error al guardar')
      setSaved(true)
      startTransition(() => router.refresh())
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  const preview = number.replace(/\D/g, '')

  return (
    <div className="flex flex-col gap-12">
      {/* WhatsApp */}
      <div>
        <h2 className="font-serif text-xl text-white mb-1">Número de WhatsApp</h2>
        <p className="label-sm mb-6" style={{ color: 'var(--color-white-muted)' }}>
          Número al que llegará el botón de WhatsApp en la web pública. Incluye el prefijo de país (ej: +34 612 345 678).
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex flex-col gap-2 w-full max-w-sm">
            <label className="label-sm" style={{ color: 'var(--color-white-muted)' }}>
              Número de WhatsApp
            </label>
            <input
              type="tel"
              value={number}
              onChange={(e) => { setNumber(e.target.value); setSaved(false) }}
              placeholder="+34 612 345 678"
              className="input-dark"
            />
            {preview && (
              <p className="label-sm" style={{ color: 'var(--color-white-subtle)' }}>
                Enlace: wa.me/{preview}
              </p>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary mt-6 sm:mt-0"
            style={{ alignSelf: 'flex-end' }}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>

        {saved && (
          <p className="label-sm mt-3" style={{ color: 'var(--color-green-bright)' }}>
            ✓ Número guardado correctamente
          </p>
        )}
        {error && (
          <p className="label-sm mt-3" style={{ color: '#f87171' }}>{error}</p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: 'var(--color-surface-2)' }} />

      {/* Info futura */}
      <div>
        <h2 className="font-serif text-xl text-white mb-1">Agente de voz</h2>
        <p className="label-sm" style={{ color: 'var(--color-white-muted)' }}>
          La configuración del agente de voz (ElevenLabs) se gestiona directamente en el panel de ElevenLabs.
          Aquí podrás ver estadísticas de llamadas próximamente.
        </p>
      </div>
    </div>
  )
}
