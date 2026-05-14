'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SERVICE_CATEGORIES } from '@/lib/types'
import type { Service } from '@/lib/types'

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-card-gold p-8 flex flex-col gap-4 h-full">
      <div className="flex items-start justify-between gap-4">
        <span className="overline" style={{ color: 'var(--color-subtle)', fontSize: '0.6rem' }}>
          {service.duration_min} min
        </span>
        <span className="font-serif text-2xl font-light" style={{ color: 'var(--color-gold)' }}>
          {service.price_eur.toFixed(0)}€
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-serif text-xl font-light mb-2" style={{ color: 'var(--color-text)' }}>
          {service.name}
        </h3>
        {service.description && (
          <p className="body-copy" style={{ fontSize: '0.875rem' }}>
            {service.description}
          </p>
        )}
      </div>

      <div className="pt-5 mt-auto" style={{ borderTop: '1px solid var(--color-border)' }}>
        <Link href={`/reservar?service=${service.id}`} className="btn-gold text-xs py-2.5 px-5">
          Reservar
        </Link>
      </div>
    </article>
  )
}

export function ServiciosCatalog({ services }: { services: Service[] }) {
  const [activeTab, setActiveTab] = useState<string>('todos')

  // Build tab list: only categories that have at least one active service
  const usedCategories = SERVICE_CATEGORIES.filter((cat) =>
    services.some((s) => s.category === cat.value)
  )
  const hasUncategorized = services.some((s) => !s.category)

  const filtered =
    activeTab === 'todos'
      ? services
      : activeTab === 'otros-sin-cat'
      ? services.filter((s) => !s.category)
      : services.filter((s) => s.category === activeTab)

  return (
    <>
      {/* Category tabs */}
      <div className="mb-12 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          <TabButton
            active={activeTab === 'todos'}
            onClick={() => setActiveTab('todos')}
          >
            Todos
          </TabButton>

          {usedCategories.map((cat) => (
            <TabButton
              key={cat.value}
              active={activeTab === cat.value}
              onClick={() => setActiveTab(cat.value)}
            >
              {cat.label}
            </TabButton>
          ))}

          {hasUncategorized && (
            <TabButton
              active={activeTab === 'otros-sin-cat'}
              onClick={() => setActiveTab('otros-sin-cat')}
            >
              Otros
            </TabButton>
          )}
        </div>
        {/* Underline separator */}
        <div className="divider-gold" style={{ marginTop: '0', opacity: 0.3 }} />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="body-copy text-center py-20">
          No hay servicios en esta categoría aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </>
  )
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="overline px-5 py-2.5 transition-all duration-200 whitespace-nowrap"
      style={{
        fontSize: '0.65rem',
        letterSpacing: '0.15em',
        background: active ? 'var(--color-gold)' : 'transparent',
        color: active ? 'var(--color-bg)' : 'var(--color-subtle)',
        border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border)'}`,
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  )
}
