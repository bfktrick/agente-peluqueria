'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="p-8 flex flex-col items-start gap-4">
      <p className="label-sm" style={{ color: '#f87171' }}>Error</p>
      <h2 className="font-serif text-2xl text-white">Algo ha fallado</h2>
      <p className="body-sm">{error.message || 'Ha ocurrido un error inesperado.'}</p>
      <button onClick={reset} className="btn-primary">
        Reintentar
      </button>
    </div>
  )
}
