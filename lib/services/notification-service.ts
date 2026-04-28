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

  async sendConfirmation(apt: Appointment): Promise<void> {
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
      '✅ Cita confirmada — AG Beauty Salon',
      `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="margin:0 0 16px">¡Cita confirmada!</h2>
          <p>Hola ${apt.customer_name}, tu cita ha sido confirmada para el ${date}.</p>
          <p>Te esperamos en Avinguda Principat d'Andorra, 10 A, Tarragona.</p>
          <p style="color:#888;font-size:12px;margin-top:24px">AG Beauty Salon</p>
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
