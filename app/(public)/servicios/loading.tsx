export default function Loading() {
  return (
    <main className="pt-28 pb-0 min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="section-pad pt-0">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="mb-16">
            <div className="h-3 w-28 rounded mb-4 animate-pulse" style={{ background: 'rgba(212,175,55,0.2)' }} />
            <div className="h-14 w-64 rounded mb-4 animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="h-px w-48 animate-pulse" style={{ background: 'rgba(212,175,55,0.15)' }} />
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden animate-pulse"
                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
              >
                <div className="h-48" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-4 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="h-3 w-full rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="h-3 w-2/3 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="flex justify-between items-center mt-2">
                    <div className="h-5 w-16 rounded" style={{ background: 'rgba(212,175,55,0.15)' }} />
                    <div className="h-3 w-20 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
