import { NextRequest, NextResponse } from 'next/server'
import { SettingsRepository } from '@/lib/repositories/settings-repository'
import { AppointmentRepository } from '@/lib/repositories/appointment-repository'
import { AvailabilityService } from '@/lib/services/availability-service'

export async function GET(req: NextRequest) {
  const settingsRepo = new SettingsRepository()
  const appointmentRepo = new AppointmentRepository()

  try {
    // 1. Read raw settings from DB
    const businessHours = await settingsRepo.getBusinessHours()
    const bookingConfig = await settingsRepo.getBookingConfig()

    // 2. Check slots for today and next 7 days
    const availabilityService = new AvailabilityService(appointmentRepo, settingsRepo)
    const results: Record<string, unknown> = {}

    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      d.setHours(0, 0, 0, 0)

      const label = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
      const dayKey = ['sun','mon','tue','wed','thu','fri','sat'][d.getDay()]

      try {
        // Duration 30 min (corte básico)
        const slots = await availabilityService.getAvailableSlots(d, 30)
        const available = slots.filter((s) => s.available)
        results[label] = {
          dayKey,
          hoursForThisDay: businessHours[dayKey ?? ''],
          totalSlots: slots.length,
          availableSlots: available.length,
          firstFew: available.slice(0, 4).map((s) => s.label),
        }
      } catch (e) {
        results[label] = { error: String(e) }
      }
    }

    return NextResponse.json({
      serverTime:    new Date().toISOString(),
      serverTZ:      Intl.DateTimeFormat().resolvedOptions().timeZone,
      businessHours,
      bookingConfig,
      slotsByDay: results,
    }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ fatalError: String(e) }, { status: 500 })
  }
}
