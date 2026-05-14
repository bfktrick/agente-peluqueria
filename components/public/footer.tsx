import { MapPin, Clock, Phone, Mail } from 'lucide-react'

interface ScheduleLine { label: string; value: string }

interface FooterProps {
  name?:          string | undefined
  tagline?:       string | undefined
  address?:       string | undefined
  phone?:         string | undefined
  instagram?:     string | undefined
  email?:         string | undefined
  scheduleLines?: ScheduleLine[] | undefined
}

const DEFAULT_SCHEDULE: ScheduleLine[] = [
  { label: 'Lunes – Viernes', value: '09:00 – 19:00' },
  { label: 'Sábado',          value: '09:00 – 14:00' },
  { label: 'Domingo',         value: 'Cerrado' },
]

export function Footer({
  name          = 'AG Beauty Salon',
  tagline       = 'Elegancia clásica y estilo moderno en el corazón de Tarragona. Tu barbería premium de confianza.',
  address       = "Avinguda Principat d'Andorra, 10 A, 43002 Tarragona",
  phone,
  instagram     = 'agbeautysalon40',
  email,
  scheduleLines = DEFAULT_SCHEDULE,
}: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative pt-24 md:pt-32 pb-8 px-6 md:px-12 lg:px-24"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-white mb-4">{name}</h3>
            <p className="text-[#A1A1AA] font-light text-sm leading-relaxed">{tagline}</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#D4AF37] mb-4 font-medium">
              Contacto
            </h4>
            <div className="space-y-3">
              {address && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#A1A1AA] mt-0.5 shrink-0" />
                  <p className="text-[#A1A1AA] text-sm font-light">{address}</p>
                </div>
              )}
              {phone && (
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-[#A1A1AA] mt-0.5 shrink-0" />
                  <a href={`tel:${phone}`} className="text-[#A1A1AA] text-sm font-light hover:text-white transition-colors">
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-[#A1A1AA] mt-0.5 shrink-0" />
                  <a href={`mailto:${email}`} className="text-[#A1A1AA] text-sm font-light hover:text-white transition-colors">
                    {email}
                  </a>
                </div>
              )}
              {instagram && (
                <div className="flex items-start gap-3">
                  <span className="text-[#A1A1AA] text-base mt-0.5 shrink-0 leading-none">IG</span>
                  <a
                    href={`https://www.instagram.com/${instagram}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A1A1AA] text-sm font-light hover:text-white transition-colors"
                  >
                    @{instagram}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Horario */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#D4AF37] mb-4 font-medium">
              Horario
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#A1A1AA] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  {scheduleLines.map(({ label, value }) => (
                    <p key={label} className="text-[#A1A1AA] text-sm font-light">
                      <span className="text-[#717171]">{label}:</span> {value}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/reservar"
                className="cta-btn inline-block bg-[#D4AF37] text-black px-6 py-2.5 rounded-full text-xs font-medium hover:bg-[#F0C84A] transition-colors"
              >
                Reservar cita
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-[#A1A1AA] text-xs font-light">
            © {year} {name} · Tarragona
          </p>
          <p className="text-xs font-light" style={{ color: 'rgba(161,161,170,0.4)' }}>
            Hecho con cuidado en España
          </p>
        </div>

        {/* Giant ghost text */}
        <div className="overflow-hidden mt-8 select-none pointer-events-none" aria-hidden>
          <p
            className="font-serif font-light whitespace-nowrap text-center leading-none"
            style={{
              fontSize: 'clamp(2.5rem, 10vw, 8rem)',
              color: 'rgba(255,255,255,0.02)',
              letterSpacing: '-0.02em',
            }}
          >
            {name.toUpperCase()}
          </p>
        </div>
      </div>
    </footer>
  )
}
