import type { Appointment, Service } from '@/lib/types'

export class NotificationService {
  private async sendEmail(to: string, subject: string, html: string) {
    // Only send if Resend API key is configured
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM_EMAIL
    if (!apiKey || !from) return

    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    await resend.emails.send({ from, to, subject, html })
  }

  async sendAppointmentRequest(apt: Appointment, service: Service): Promise<void> {
    if (!apt.customer_email) return

    const date = new Date(apt.scheduled_at).toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })

    await this.sendEmail(
      apt.customer_email,
      'Solicitud de cita recibida — AG Beauty Salon',
      `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="margin:0 0 16px">Hola, ${apt.customer_name} 👋</h2>
          <p>Hemos recibido tu solicitud de cita:</p>
          <div style="background:#f5f5f5;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:4px 0"><strong>Servicio:</strong> ${service.name}</p>
            <p style="margin:4px 0"><strong>Fecha:</strong> ${date}</p>
            <p style="margin:4px 0"><strong>Precio:</strong> ${service.price_eur.toFixed(2)}€</p>
          </div>
          <p>Te confirmaremos la cita en breve. Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p style="color:#888;font-size:12px;margin-top:24px">AG Beauty Salon · Avinguda Principat d'Andorra, 10 A · Tarragona</p>
        </div>
      `
    )
  }

  async sendConfirmation(apt: Appointment, service?: Service): Promise<void> {
    if (!apt.customer_email) return

    const date = new Date(apt.scheduled_at).toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })

    await this.sendEmail(
      apt.customer_email,
      'Cita confirmada — AG Beauty Salon',
      `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;color:#111">
          <h2 style="margin:0 0 8px;font-size:22px">Cita confirmada</h2>
          <p style="color:#555;margin:0 0 24px">Hola <strong>${apt.customer_name}</strong>, tu reserva está confirmada.</p>
          <div style="background:#f8f8f8;border-radius:8px;padding:20px;margin-bottom:24px">
            ${service ? `<p style="margin:6px 0"><strong>Servicio:</strong> ${service.name}</p>` : ''}
            <p style="margin:6px 0"><strong>Fecha y hora:</strong> ${date}</p>
            ${service ? `<p style="margin:6px 0"><strong>Precio:</strong> ${service.price_eur.toFixed(2)} €</p>` : ''}
            <p style="margin:6px 0"><strong>Duración:</strong> ${service?.duration_min ?? '—'} min</p>
          </div>
          <p style="margin:0 0 6px"><strong>Dónde:</strong> Avinguda Principat d'Andorra, 10 A, 43002 Tarragona</p>
          <p style="color:#888;font-size:12px;margin-top:28px;border-top:1px solid #eee;padding-top:16px">
            AG Beauty Salon · Si necesitas cancelar, contáctanos con antelación.
          </p>
        </div>
      `
    )
  }

  async sendCancellation(apt: Appointment): Promise<void> {
    if (!apt.customer_email) return

    await this.sendEmail(
      apt.customer_email,
      'Cita cancelada — AG Beauty Salon',
      `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="margin:0 0 16px">Cita cancelada</h2>
          <p>Hola ${apt.customer_name}, tu cita ha sido cancelada.</p>
          <p>Si quieres reservar otra fecha, puedes hacerlo en nuestra web.</p>
          <p style="color:#888;font-size:12px;margin-top:24px">AG Beauty Salon</p>
        </div>
      `
    )
  }

  async sendReminder(apt: Appointment): Promise<void> {
    if (!apt.customer_email) return

    const date = new Date(apt.scheduled_at).toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })

    await this.sendEmail(
      apt.customer_email,
      '⏰ Recordatorio: tienes cita mañana — AG Beauty Salon',
      `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="margin:0 0 16px">Recordatorio de cita</h2>
          <p>Hola ${apt.customer_name}, te recordamos que tienes cita mañana ${date}.</p>
          <p>Te esperamos en Avinguda Principat d'Andorra, 10 A, Tarragona.</p>
          <p style="color:#888;font-size:12px;margin-top:24px">AG Beauty Salon</p>
        </div>
      `
    )
  }
}
