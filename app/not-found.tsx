import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--color-bg)' }}
    >
      <p
        className="font-serif select-none pointer-events-none"
        style={{
          fontSize: 'clamp(6rem, 20vw, 14rem)',
          color: 'rgba(255,255,255,0.03)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          position: 'absolute',
        }}
        aria-hidden
      >
        404
      </p>

      <div className="relative z-10">
        <p className="overline mb-6">Página no encontrada</p>
        <h1 className="h-title mb-4">
          Esta página<br />
          <em className="not-italic" style={{ color: 'var(--color-gold)' }}>no existe</em>
        </h1>
        <p className="body-copy mb-10 max-w-sm mx-auto">
          El enlace puede haber cambiado o la página fue eliminada.
        </p>
        <Link
          href="/"
          className="btn-gold"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
