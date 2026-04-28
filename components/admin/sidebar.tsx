'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard',          label: 'Resumen',    icon: '◈' },
  { href: '/dashboard/citas',    label: 'Citas',      icon: '◷' },
  { href: '/dashboard/servicios', label: 'Servicios', icon: '✦' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-56 shrink-0 min-h-screen flex flex-col"
      style={{
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-surface-2)',
      }}
    >
      {/* Logo */}
      <div
        className="px-6 py-5 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--color-surface-2)' }}
      >
        <div
          className="w-7 h-7 flex items-center justify-center"
          style={{ background: 'var(--color-green-forest)' }}
        >
          <span className="font-serif text-xs" style={{ color: 'var(--color-green-bright)' }}>AG</span>
        </div>
        <div>
          <p className="font-serif text-sm text-white leading-none">AG Beauty</p>
          <p className="label-sm" style={{ fontSize: '9px' }}>Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== '/dashboard' && pathname.startsWith(l.href))
          return (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-3 py-2.5 transition-all duration-200"
              style={{
                background: active ? 'var(--color-green-deep)' : 'transparent',
                color: active ? 'var(--color-white)' : 'var(--color-white-muted)',
                borderLeft: active ? '2px solid var(--color-green-sage)' : '2px solid transparent',
              }}
            >
              <span className="text-sm" style={{ color: active ? 'var(--color-green-bright)' : 'var(--color-white-subtle)' }}>
                {l.icon}
              </span>
              <span className="label text-xs">{l.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: '1px solid var(--color-surface-2)' }}>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors duration-200"
            style={{ color: 'var(--color-white-subtle)' }}
          >
            <span className="text-sm">→</span>
            <span className="label text-xs">Cerrar sesión</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
