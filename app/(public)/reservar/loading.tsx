export default function Loading() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-6" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-10 text-center">
          <div className="h-3 w-24 rounded mx-auto mb-4 animate-pulse" style={{ background: 'rgba(212,175,55,0.2)' }} />
          <div className="h-12 w-56 rounded mx-auto animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Steps skeleton */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full animate-pulse"
                style={{ background: n === 1 ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.06)' }}
              />
              {n < 3 && <div className="w-10 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />}
            </div>
          ))}
        </div>

        {/* Card skeleton */}
        <div
          className="rounded-xl p-8 animate-pulse"
          style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)' }}>
                <div className="h-4 w-3/4 rounded mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-3 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
