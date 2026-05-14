'use client'

import { useState } from 'react'

export function CredentialsForm({ currentEmail }: { currentEmail: string }) {
  const [email, setEmail]       = useState(currentEmail)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/auth/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json() as { success: boolean; error?: string }
      if (!json.success) throw new Error(json.error ?? 'Error al guardar')
      setSaved(true)
      setPassword('')
      setConfirm('')
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <div
        className="p-6 flex flex-col gap-5"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="label" htmlFor="email">Email de acceso</label>
          <input
            id="email"
            type="email"
            className="input-dark"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setSaved(false) }}
            required
          />
        </div>

        <div className="h-px" style={{ background: 'var(--color-surface-2)' }} />

        <div className="flex flex-col gap-1.5">
          <label className="label" htmlFor="password">Nueva contraseña</label>
          <input
            id="password"
            type="password"
            className="input-dark"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setSaved(false) }}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="label" htmlFor="confirm">Confirmar contraseña</label>
          <input
            id="confirm"
            type="password"
            className="input-dark"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setSaved(false) }}
            placeholder="Repite la contraseña"
            required
          />
        </div>
      </div>

      {error && <p className="label-sm" style={{ color: '#f87171' }}>{error}</p>}
      {saved && (
        <p className="label-sm" style={{ color: 'var(--color-green-bright)' }}>
          ✓ Credenciales actualizadas. Úsalas la próxima vez que inicies sesión.
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary self-start">
        {saving ? 'Guardando...' : 'Guardar credenciales'}
      </button>
    </form>
  )
}
