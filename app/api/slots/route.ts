import { NextRequest, NextResponse } from 'next/server'
import { ServiceRepository } from '@/lib/repositories/service-repository'
import { AppointmentRepository } from '@/lib/repositories/appointment-repository'
import { SettingsRepository } from '@/lib/repositories/settings-repository'
import { AvailabilityService } from '@/lib/services/availability-service'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date      = searchParams.get('date')       // YYYY-MM-DD
  const serviceId = searchParams.get('service_id')

  if (!date || !serviceId) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'date and service_id are required' } },
      { status: 400 }
    )
  }

  const dateObj = new Date(date + 'T00:00:00')
  if (isNaN(dateObj.getTime())) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid date format' } },
      { status: 400 }
    )
  }

  try {
    const serviceRepo = new ServiceRepository()
    const service = await serviceRepo.findById(serviceId)
    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Service not found' } },
        { status: 404 }
      )
    }

    const availabilityService = new AvailabilityService(
      new AppointmentRepository(),
      new SettingsRepository()
    )
    const slots = await availabilityService.getAvailableSlots(dateObj, service.duration_min)

    return NextResponse.json({ success: true, data: slots })
  } catch (error) {
    console.error('GET /api/slots:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno' } },
      { status: 500 }
    )
  }
}
