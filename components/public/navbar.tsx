'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Servicios',      href: '/#servicios' },
  { label: 'Opiniones',      href: '/#opiniones' },
  { label: 'Sobre nosotros', href: '/#experiencia' },
  { label: 'Contacto',       href: '/#contacto' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="mx-auto max-w-6xl px-5 h-12 flex items-center justify-between gap-6">
        {/* Logo */}
        <a
          href="/"
          className="font-serif text-base font-semibold tracking-wider text-white shrink-0"
        >
          AG Beauty
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded text-xs font-light tracking-wide text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          {!pathname.startsWith('/reservar') && (
            <a
              href="/reservar"
              className="hidden md:inline-block bg-[#D4AF37] text-black px-4 py-1.5 rounded text-xs font-medium hover:bg-[#F0C84A] transition-colors shrink-0"
            >
              Reservar citas
            </a>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-1"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex flex-col px-5 py-3 gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm text-[#A1A1AA] hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              ))}
              {!pathname.startsWith('/reservar') && (
                <a
                  href="/reservar"
                  onClick={() => setOpen(false)}
                  className="mt-2 text-center bg-[#D4AF37] text-black px-4 py-2 rounded text-sm font-medium hover:bg-[#F0C84A] transition-colors"
                >
                  Reservar citas
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
