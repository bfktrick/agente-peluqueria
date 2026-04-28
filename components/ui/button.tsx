import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-label tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-sage focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-40 disabled:cursor-not-allowed'

    const variants = {
      primary:
        'bg-green-mid text-white hover:bg-green-sage hover:shadow-green-glow',
      outline:
        'border border-green-mid text-white hover:bg-green-mid hover:shadow-green-glow-sm',
      ghost:
        'text-white-muted hover:text-white',
    }

    const sizes = {
      sm: 'text-[10px] px-5 py-2',
      md: 'text-xs px-8 py-3.5',
      lg: 'text-xs px-10 py-4',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
