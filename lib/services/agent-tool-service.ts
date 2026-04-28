import { ServiceRepository } from '@/lib/repositories/service-repository'
import { AppointmentRepository } from '@/lib/repositories/appointment-repository'
import { SettingsRepository } from '@/lib/repositories/settings-repository'
import { AvailabilityService } from '@/lib/services/availability-service'
import { AppointmentService } from '@/lib/services/appointment-service'

type ToolName =
  | 'get_services'
  | 'get_available_slots'
  | 'request_appointment'
  | 'cancel_appointment'
  | 'get_business_info'

interface ToolParams {
  service_name?: string
  date?: string
  customer_name?: string
  customer_phone?: string
  scheduled_at?: string
}

export class AgentToolService {
  private serviceRepo     = new ServiceRepository()
  private appointmentRepo = new AppointmentRepository()
  private settingsRepo    = new SettingsRepository()
  private appointmentSvc  = new AppointmentService()

  async handle(tool: ToolName, params: ToolParams): Promise<unknown> {
    switch (tool) {
      case 'get_services':        return this.getServices()
      case 'get_available_slots': return this.getAvailableSlots(params)
      case 'request_appointment': return this.requestAppointment(params)
      case 'cancel_appointment':  return this.cancelAppointment(params)
      case 'get_business_info':   return this.getBusinessInfo()
      default:
        throw new Error(`Tool desconocida: ${String(tool)}`)
    }
  }

  private async getServices() {
    const services = await this.serviceRepo.findAllActive()
    return services.map((s) => ({
      name:         s.name,
      duration_min: s.duration_min,
      price_eur:    s.price_eur,
      description:  s.description,
    }))
  }

  private async getAvailableSlots(params: ToolParams) {
    const { service_name, date } = params
    if (!service_name) return { error: 'service_name es obligatorio' }

    const services = await this.serviceRepo.findAllActive()
    const service = services.find((s) =>
      s.name.toLowerCase().includes(service_name.toLowerCase())
    )
    if (!service) return { error: `No encuentro el servicio: ${service_name}` }

    const targetDate = date ? new Date(date + 'T00:00:00') : new Date()
    const availabilityService = new AvailabilityService(this.appointmentRepo, this.settingsRepo)
    const slots = await availabilityService.getAvailableSlots(targetDate, service.duration_min)

    return slots.filter((s) => s.available).slice(0, 8)
  }

  private async requestAppointment(params: ToolParams) {
    const { customer_name, customer_phone, service_name, scheduled_at } = params

    if (!customer_name || !customer_phone || !service_name || !scheduled_at) {
      return { error: 'Faltan parámetros: customer_name, customer_phone, service_name, scheduled_at' }
    }

    const services = await this.serviceRepo.findAllActive()
    const service = services.find((s) =>
      s.name.toLowerCase().includes(service_name.toLowerCase())
    )
    if (!service) return { error: `Servicio no encontrado: ${service_name}` }

    const appointment = await this.appointmentSvc.createAppointment({
      customer_name,
      customer_phone,
      service_id:   service.id,
      scheduled_at,
      channel:      'voice',
    })

    const date = new Date(appointment.scheduled_at).toLocaleString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    })

    return { message: `Cita registrada para ${customer_name} el ${date}`, id: appointment.id }
  }

  private async cancelAppointment(params: ToolParams) {
    const { customer_phone } = params
    if (!customer_phone) return { error: 'customer_phone es obligatorio' }

    const apts = await this.appointmentRepo.findAll()
    const apt = apts
      .filter((a) => a.customer_phone === customer_phone)
      .filter((a) => a.status === 'pending' || a.status === 'confirmed')
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
      .at(0)

    if (!apt) return { error: `No encuentro una cita activa para el teléfono ${customer_phone}` }

    await this.appointmentSvc.updateStatus(apt.id, 'cancelled')
    return { message: `Cita cancelada correctamente` }
  }

  private async getBusinessInfo() {
    return this.settingsRepo.get('business_info')
  }
}
