import { AppointmentRepository } from '@/lib/repositories/appointment-repository'
import { ServiceRepository } from '@/lib/repositories/service-repository'
import { SettingsRepository } from '@/lib/repositories/settings-repository'
import { AvailabilityService } from '@/lib/services/availability-service'
import { NotificationService } from '@/lib/services/notification-service'
import type { Appointment, CreateAppointmentDto } from '@/lib/types'

export class AppointmentService {
  private appointmentRepo = new AppointmentRepository()
  private serviceRepo = new ServiceRepository()
  private settingsRepo = new SettingsRepository()
  private notificationService = new NotificationService()

  async createAppointment(dto: CreateAppointmentDto): Promise<Appointment> {
    const service = await this.serviceRepo.findById(dto.service_id)
    if (!service) throw new Error('Servicio no encontrado')

    const scheduledDate = new Date(dto.scheduled_at)
    const availabilityService = new AvailabilityService(this.appointmentRepo, this.settingsRepo)
    const slots = await availabilityService.getAvailableSlots(scheduledDate, service.duration_min)

    // Compare by timestamp (±5 min tolerance) to handle timezone/format differences
    const requestedMs = scheduledDate.getTime()
    const requestedSlot = slots.find(
      (s) => Math.abs(new Date(s.datetime).getTime() - requestedMs) <= 5 * 60_000
    )
    if (!requestedSlot?.available) {
      throw new Error('El horario seleccionado no está disponible')
    }

    // Use the slot's own datetime to guarantee format consistency in DB
    dto = { ...dto, scheduled_at: requestedSlot.datetime }

    // Web bookings are auto-confirmed — no manual review needed if slot is free
    // Voice/WhatsApp bookings stay as 'pending' for owner review
    const status = dto.channel === 'web' ? 'confirmed' : 'pending'
    const appointment = await this.appointmentRepo.insert(dto, status)

    // Non-blocking notification
    if (status === 'confirmed') {
      this.notificationService
        .sendConfirmation(appointment, service)
        .catch((err: unknown) => console.error('Notification error:', err))
    } else {
      this.notificationService
        .sendAppointmentRequest(appointment, service)
        .catch((err: unknown) => console.error('Notification error:', err))
    }

    return appointment
  }

  async updateStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    const appointment = await this.appointmentRepo.updateStatus(id, status)

    if (status === 'confirmed') {
      this.notificationService
        .sendConfirmation(appointment)
        .catch((err: unknown) => console.error('Notification error:', err))
    } else if (status === 'cancelled') {
      this.notificationService
        .sendCancellation(appointment)
        .catch((err: unknown) => console.error('Notification error:', err))
    }

    return appointment
  }
}
