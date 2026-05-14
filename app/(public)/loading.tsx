export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="flex flex-col items-center gap-5">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{
            borderColor: 'rgba(212,175,55,0.2)',
            borderTopColor: 'var(--color-gold)',
          }}
        />
        <p className="overline" style={{ color: 'var(--color-gold)' }}>
          Cargando
        </p>
      </div>
    </div>
  )
}
