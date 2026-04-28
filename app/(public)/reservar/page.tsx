import type { Metadata } from 'next'
import { FadeIn } from '@/components/ui/fade-in'

export const metadata: Metadata = {
  title: 'Reservar cita',
  description: 'Reserva tu cita en AG Beauty Salon. Elige tu servicio, fecha y hora en segundos.',
}

export default function ReservarPage() {
  return (
    <main className="pt-24 pb-28 px-6 min-h-screen section-full" style={{ background: 'var(--color-black)' }}>
      <FadeIn direction="up">
        <div className="text-center">
          <span className="label block mb-4">Próximamente</span>
          <h1 className="heading-lg mb-4">Reserva online</h1>
          <p className="body max-w-md mx-auto">
            El sistema de reservas estará disponible en breve.
            Por ahora, contáctanos directamente.
          </p>
        </div>
      </FadeIn>
    </main>
  )
}
