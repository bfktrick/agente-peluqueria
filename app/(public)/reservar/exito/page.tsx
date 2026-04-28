import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeIn } from '@/components/ui/fade-in'

export const metadata: Metadata = { title: 'Cita solicitada' }

export default function ExitoPage() {
  return (
    <main className="pt-24 pb-28 px-6 min-h-screen section-full" style={{ background: 'var(--color-black)' }}>
      <FadeIn direction="up">
        <div
          className="max-w-md mx-auto text-center p-12"
          style={{
            background: 'var(--color-green-deep)',
            border: '1px solid var(--color-green-mid)',
            boxShadow: 'var(--shadow-green-glow)',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--color-green-forest)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="var(--color-green-bright)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="heading-sm mb-4">¡Solicitud enviada!</h1>
          <p className="body mb-8">
            Hemos recibido tu solicitud de cita. Te confirmaremos en breve.
            Si proporcionaste tu email, recibirás un mensaje de confirmación.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/reservar" className="btn-outline">
              Hacer otra reserva
            </Link>
            <Link href="/" className="btn-ghost justify-center">
              Volver al inicio
            </Link>
          </div>
        </div>
      </FadeIn>
    </main>
  )
}
