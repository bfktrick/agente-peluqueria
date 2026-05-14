export default function DashboardLoading() {
  return (
    <div className="p-8 flex flex-col gap-6 w-full max-w-xl">
      <div className="h-3 w-20 rounded animate-pulse" style={{ background: 'var(--color-surface-3)' }} />
      <div className="h-8 w-56 rounded animate-pulse" style={{ background: 'var(--color-surface-2)' }} />
      <div className="flex flex-col gap-3 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded animate-pulse" style={{ background: 'var(--color-surface)' }} />
        ))}
      </div>
    </div>
  )
}
