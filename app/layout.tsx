import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { PageTransition } from '@/components/ui/page-transition'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AG Beauty Salon | Tarragona',
    template: '%s | AG Beauty Salon',
  },
  description:
    'Barbería y salón de belleza profesional en Tarragona. Cortes, arreglo de barba y más. Reserva tu cita online.',
  keywords: ['peluquería', 'barbería', 'tarragona', 'corte de pelo', 'barba', 'AG Beauty Salon'],
  authors: [{ name: 'AG Beauty Salon' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'AG Beauty Salon',
    title: 'AG Beauty Salon | Tarragona',
    description: 'Barbería y salón de belleza profesional en Tarragona. Reserva tu cita online.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-black text-white antialiased cursor-none overflow-x-hidden">
        <CustomCursor />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
