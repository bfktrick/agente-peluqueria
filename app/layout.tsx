import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Cinzel_Decorative } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AG Beauty Salon | Barbería en Tarragona',
    template: '%s | AG Beauty Salon',
  },
  description:
    'Barbería y salón de belleza profesional en Tarragona. Cortes degradado, arreglo de barba y más. Reserva tu cita online.',
  keywords: ['peluquería', 'barbería', 'tarragona', 'corte de pelo', 'barba', 'AG Beauty Salon'],
  authors: [{ name: 'AG Beauty Salon' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'AG Beauty Salon',
    title: 'AG Beauty Salon | Barbería en Tarragona',
    description: 'Barbería y salón de belleza profesional en Tarragona. Reserva tu cita online.',
    images: [{ url: '/header.png', width: 1200, height: 630, alt: 'AG Beauty Salon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AG Beauty Salon | Barbería en Tarragona',
    description: 'Barbería y salón de belleza profesional en Tarragona.',
    images: ['/header.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://agbeautysalon.com' },
}

export const viewport: Viewport = {
  themeColor: '#080808',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <body className="noise">
        {children}
      </body>
    </html>
  )
}
