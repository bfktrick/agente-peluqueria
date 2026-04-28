import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'muted' | 'pending' | 'confirmed' | 'cancelled' | 'completed'
  className?: string
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  green:     'bg-green-deep border-green-mid text-green-light',
  muted:     'bg-surface-2 border-surface-3 text-white-muted',
  pending:   'bg-surface-2 border-yellow-700 text-yellow-400',
  confirmed: 'bg-green-deep border-green-mid text-green-light',
  cancelled: 'bg-surface-2 border-red-800 text-red-400',
  completed: 'bg-surface-2 border-surface-3 text-white-subtle',
}

export function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-label text-[10px] tracking-widest uppercase border px-2.5 py-1',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
