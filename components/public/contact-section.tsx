import Link from 'next/link'
import { FadeIn } from '@/components/ui/fade-in'

export function ContactSection() {
  return (
    <section className="py-28 px-6" style={{ background: 'var(--color-green-deep)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Info */}
          <FadeIn direction="right">
            <div>
              <span className="label block mb-4">Encuéntranos</span>
              <h2 className="heading-lg mb-8">
                AG Beauty<br />
                <em className="not-italic" style={{ color: 'var(--color-green-bright)' }}>Salon</em>
              </h2>

              <div className="flex flex-col gap-5">
                <div>
                  <span className="label-sm block mb-1">Dirección</span>
                  <p className="body">
                    Avinguda Principat d&apos;Andorra, 10 A<br />
                    43002 Tarragona
                  </p>
                </div>

                <div>
                  <span className="label-sm block mb-1">Horario</span>
                  <p className="body">
                    Lunes – Viernes: 09:00 – 19:00<br />
                    Sábado: 09:00 – 14:00<br />
                    Domingo: Cerrado
                  </p>
                </div>

                <div>
                  <span className="label-sm block mb-1">Instagram</span>
                  <a
                    href="https://www.instagram.com/agbeautysalon40/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="body transition-colors duration-200 hover:text-white"
                  >
                    @agbeautysalon40
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* CTA card */}
          <FadeIn direction="left" delay={0.15}>
            <div
              className="p-10 flex flex-col gap-6"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-green-mid)',
                boxShadow: 'var(--shadow-green-glow)',
              }}
            >
              <div>
                <span className="label block mb-3">¿Listo para el cambio?</span>
                <h3 className="heading-md">
                  Reserva tu cita<br />en segundos
                </h3>
              </div>
              <p className="body-sm">
                Sistema de reserva online disponible 24/7. Sin esperas, sin llamadas.
                Elige tu servicio, fecha y hora en menos de 2 minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/reservar" className="btn-primary">
                  Reservar ahora
                </Link>
                <a
                  href="tel:+34"
                  className="btn-outline"
                  aria-label="Llamar al salón"
                >
                  Llamar
                </a>
              </div>

              <div className="divider-green" />

              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ background: 'var(--color-green-forest)' }}
                >
                  <span
                    className="font-serif text-sm"
                    style={{ color: 'var(--color-green-bright)' }}
                  >
                    4.9
                  </span>
                </div>
                <div>
                  <p className="body-sm" style={{ color: 'var(--color-white)' }}>
                    Valoración media
                  </p>
                  <p className="label-sm">Basado en 51 reseñas</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
