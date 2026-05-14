'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--color-bg)' }}
    >
      <p className="overline mb-6" style={{ color: '#f87171' }}>Error inesperado</p>
      <h1 className="h-title mb-4">Algo ha salido mal</h1>
      <p className="body-copy mb-10 max-w-sm mx-auto">
        Ha ocurrido un error en la aplicación. Puedes intentarlo de nuevo.
      </p>
      <div className="flex gap-4">
        <button onClick={reset} className="btn-gold">
          Intentar de nuevo
        </button>
        <a href="/" className="btn-ghost-gold">
          Ir al inicio
        </a>
      </div>
    </main>
  )
}
