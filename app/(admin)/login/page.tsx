'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/spinner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--color-black)' }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-2xl text-white mb-1">AG Beauty</h1>
          <p className="label">Panel de administración</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-8"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)' }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-dark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input-dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="body-sm" style={{ color: '#f87171' }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary w-full justify-center mt-2"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}
