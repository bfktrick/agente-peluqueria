import { ServiceRepository } from '@/lib/repositories/service-repository'
import { AppointmentRepository } from '@/lib/repositories/appointment-repository'
import { SettingsRepository } from '@/lib/repositories/settings-repository'
import { AvailabilityService } from '@/lib/services/availability-service'
import { AppointmentService } from '@/lib/services/appointment-service'

export type AgentToolName =
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

// Keywords that map to service name fragments
// Key: word the customer might say → values: fragments that should match in service names
const SYNONYMS: Record<string, string[]> = {
  // Cortes
  'pelo':        ['corte', 'degradado', 'caballero'],
  'cabello':     ['corte', 'coloración', 'balayage', 'bleaching'],
  'corte':       ['corte', 'degradado'],
  'rapado':      ['rapado'],
  'degradado':   ['degradado'],
  'niño':        ['niños'],
  'niños':       ['niños'],
  'infantil':    ['niños'],
  // Barba
  'barba':       ['barba'],
  'afeitado':    ['afeitado', 'barba'],
  // Color
  'tinte':       ['coloración'],
  'color':       ['coloración', 'balayage'],
  'balayage':    ['balayage'],
  'mechas':      ['balayage', 'coloración'],
  'decolorar':   ['bleaching'],
  'aclarar':     ['bleaching'],
  'rubio':       ['bleaching'],
  // Estética facial
  'limpieza':    ['limpieza facial', 'facial'],
  'facial':      ['facial', 'limpieza'],
  'cara':        ['facial', 'limpieza'],
  'piel':        ['facial', 'tratamiento'],
  'tratamiento': ['tratamiento'],
  // Maquillaje
  'maquillaje':  ['maquillaje'],
  'maquillo':    ['maquillaje'],
  // Uñas
  'uñas':        ['manicura', 'pedicura'],
  'manos':       ['manicura'],
  'pies':        ['pedicura'],
  'manicura':    ['manicura'],
  'pedicura':    ['pedicura'],
  // Pestañas / cejas
  'pestañas':    ['pestañas'],
  'extensiones': ['extensiones'],
  'cejas':       ['microblading'],
  'microblading':['microblading'],
  // Depilación
  'depilación':  ['depilación'],
  'depilar':     ['depilación'],
  'cera':        ['cera'],
  'láser':       ['láser'],
  'laser':       ['láser'],
  'axilas':      ['axilas'],
  // Peinado
  'peinado':     ['peinado', 'styling'],
  'trenzas':     ['trenzas'],
  'styling':     ['styling'],
}

// Parse flexible date input: "hoy", "mañana", day names, YYYY-MM-DD, or datetime strings
// If the resulting date is in the past (e.g. LLM hallucinated year 2023), falls back to today.
function parseDate(input: string | undefined): Date {
  if (!input) return new Date()

  const s = input.trim().toLowerCase()
  const today = new Date()

  if (s === 'hoy' || s === 'today')   return today
  if (s === 'mañana' || s === 'tomorrow') {
    const d = new Date(); d.setDate(d.getDate() + 1); return d
  }
  if (s === 'pasado mañana' || s === 'pasado') {
    const d = new Date(); d.setDate(d.getDate() + 2); return d
  }

  // Day names → next occurrence
  const dayNames = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
  const dayIdx = dayNames.findIndex((d) => s.includes(d))
  if (dayIdx !== -1) {
    const d = new Date()
    let ahead = dayIdx - d.getDay()
    if (ahead <= 0) ahead += 7
    d.setDate(d.getDate() + ahead)
    return d
  }

  // Strip time component if present (handles "2026-05-10T10:00:00" → "2026-05-10")
  const dateOnly = input.split('T')[0] ?? input
  const parsed = new Date(dateOnly + 'T00:00:00')
  if (isNaN(parsed.getTime())) return new Date()

  // If the LLM sent a date in the past (wrong year, etc.), ignore it and start from today
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (parsed < yesterday) return new Date()

  return parsed
}

function normalize(s: string): string {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // remove accents
    .replace(/[^a-z0-9\s]/g, '')
}

function matchService(query: string, serviceName: string): number {
  const q    = normalize(query)
  const name = normalize(serviceName)

  // Exact or substring match → highest score
  if (name.includes(q) || q.includes(name)) return 100

  let score = 0
  const queryWords = q.split(/\s+/).filter(Boolean)

  for (const word of queryWords) {
    // Direct word match in service name
    if (name.includes(word)) { score += 20; continue }

    // Synonym expansion
    const synonymTargets = SYNONYMS[word] ?? []
    for (const target of synonymTargets) {
      if (name.includes(normalize(target))) { score += 15; break }
    }
  }

  return score
}

function findBestService<T extends { name: string }>(query: string, services: T[]): T | null {
  if (!query.trim()) return null

  const scored = services
    .map((s) => ({ service: s, score: matchService(query, s.name) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored[0]?.service ?? null
}

export class AgentToolService {
  private serviceRepo     = new ServiceRepository()
  private appointmentRepo = new AppointmentRepository()
  private settingsRepo    = new SettingsRepository()
  private appointmentSvc  = new AppointmentService()

  async handle(tool: AgentToolName, params: ToolParams): Promise<unknown> {
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
    const service = findBestService(service_name, services)
    if (!service) return { error: `No encuentro un servicio parecido a "${service_name}". Usa get_services para ver la lista completa.` }

    const availabilityService = new AvailabilityService(this.appointmentRepo, this.settingsRepo)
    const startDate = parseDate(date)

    // Try up to 14 consecutive days starting from the requested date
    for (let i = 0; i < 14; i++) {
      const tryDate = new Date(startDate)
      tryDate.setDate(tryDate.getDate() + i)

      const slots = await availabilityService.getAvailableSlots(tryDate, service.duration_min)
      const available = slots.filter((s) => s.available)

      if (available.length > 0) {
        const dateLabel = tryDate.toLocaleDateString('es-ES', {
          weekday: 'long', day: 'numeric', month: 'long',
        })
        // Use local date parts to avoid UTC offset shifting the date string
        const localDate = [
          tryDate.getFullYear(),
          String(tryDate.getMonth() + 1).padStart(2, '0'),
          String(tryDate.getDate()).padStart(2, '0'),
        ].join('-')
        return {
          date:       localDate,
          date_label: dateLabel,
          service:    service.name,
          slots:      available.slice(0, 6).map((s) => ({ time: s.label, datetime: s.datetime })),
        }
      }
    }

    return { error: 'No hay disponibilidad en los próximos 14 días para este servicio.' }
  }

  private async requestAppointment(params: ToolParams) {
    const { customer_name, customer_phone, service_name, scheduled_at } = params

    if (!customer_name || !customer_phone || !service_name || !scheduled_at) {
      return { error: 'Faltan parámetros: customer_name, customer_phone, service_name, scheduled_at' }
    }

    // Guard: reject dates in the past or more than 60 days ahead (catches LLM year hallucinations)
    const scheduledDate = new Date(scheduled_at)
    if (isNaN(scheduledDate.getTime())) {
      return { error: `Formato de fecha inválido: "${scheduled_at}". Usa el valor "datetime" exacto que devolvió get_available_slots.` }
    }
    const now = new Date()
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 60)
    if (scheduledDate < now) {
      return { error: `El horario "${scheduled_at}" ya ha pasado. Confirma la fecha y hora con el cliente y usa el datetime exacto de get_available_slots.` }
    }
    if (scheduledDate > maxDate) {
      return { error: `La fecha "${scheduled_at}" está demasiado lejos (más de 60 días). Confirma la fecha correcta con el cliente y usa el datetime exacto que devolvió get_available_slots.` }
    }

    const services = await this.serviceRepo.findAllActive()
    const service = findBestService(service_name, services)
    if (!service) return { error: `Servicio no encontrado: "${service_name}". Llama a get_services para ver qué servicios hay disponibles.` }

    // Find the canonical slot datetime to avoid timezone/format mismatches
    const requestedMs = scheduledDate.getTime()
    const availabilityService = new AvailabilityService(this.appointmentRepo, this.settingsRepo)
    const slots = await availabilityService.getAvailableSlots(
      scheduledDate,
      service.duration_min
    )
    const matchingSlot = slots.find(
      (s) => Math.abs(new Date(s.datetime).getTime() - requestedMs) <= 5 * 60_000 && s.available
    )

    if (!matchingSlot) {
      return { error: 'El horario solicitado no está disponible o ya está ocupado. Pregunta al cliente otro horario.' }
    }

    const appointment = await this.appointmentSvc.createAppointment({
      customer_name,
      customer_phone,
      service_id:   service.id,
      scheduled_at: matchingSlot.datetime, // use canonical UTC datetime from our system
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
