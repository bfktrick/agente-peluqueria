import type { TimeSlot } from '@/lib/types'
import type { AppointmentRepository } from '@/lib/repositories/appointment-repository'
import type { SettingsRepository } from '@/lib/repositories/settings-repository'

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

export class AvailabilityService {
  constructor(
    private appointmentRepo: AppointmentRepository,
    private settingsRepo: SettingsRepository
  ) {}

  async getAvailableSlots(date: Date, serviceDurationMin: number): Promise<TimeSlot[]> {
    const dayKey = DAY_KEYS[date.getDay()]!
    const [hoursMap, config] = await Promise.all([
      this.settingsRepo.getBusinessHours(),
      this.settingsRepo.getBookingConfig(),
    ])

    const dayHours = hoursMap[dayKey]
    if (!dayHours) return [] // closed

    const existing = await this.appointmentRepo.findByDate(date)

    const openMin  = toMinutes(dayHours.open)
    const closeMin = toMinutes(dayHours.close)
    const interval = config.slot_interval_min
    const minNotice = new Date(Date.now() + config.min_notice_hours * 60 * 60_000)

    const breakStart = dayHours.break ? toMinutes(dayHours.break.start) : null
    const breakEnd   = dayHours.break ? toMinutes(dayHours.break.end)   : null

    const slots: TimeSlot[] = []

    for (let m = openMin; m + serviceDurationMin <= closeMin; m += interval) {
      // Skip break window
      if (breakStart !== null && breakEnd !== null && m >= breakStart && m < breakEnd) continue

      const slotDate = new Date(date)
      slotDate.setHours(Math.floor(m / 60), m % 60, 0, 0)

      // Check overlap with existing appointments
      const overlaps = existing.some((apt) => {
        if (!apt.service) return false
        const aptStart = new Date(apt.scheduled_at).getTime()
        const aptEnd   = aptStart + apt.service.duration_min * 60_000
        const slotStart = slotDate.getTime()
        const slotEnd   = slotStart + serviceDurationMin * 60_000
        return slotStart < aptEnd && slotEnd > aptStart
      })

      const available = !overlaps && slotDate > minNotice

      const h   = String(Math.floor(m / 60)).padStart(2, '0')
      const min = String(m % 60).padStart(2, '0')

      slots.push({ datetime: slotDate.toISOString(), label: `${h}:${min}`, available })
    }

    return slots
  }

  async getAvailableDates(startDate: Date, days: number, serviceDurationMin: number): Promise<string[]> {
    const hoursMap = await this.settingsRepo.getBusinessHours()
    const available: string[] = []

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const dayKey = DAY_KEYS[d.getDay()]!
      if (!hoursMap[dayKey]) continue

      const slots = await this.getAvailableSlots(d, serviceDurationMin)
      if (slots.some((s) => s.available)) {
        available.push(d.toISOString().split('T')[0]!)
      }
    }

    return available
  }
}
