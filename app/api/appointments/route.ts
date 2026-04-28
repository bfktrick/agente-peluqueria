import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AppointmentService } from '@/lib/services/appointment-service'
import type { CreateAppointmentDto } from '@/lib/types'

const CreateAppointmentSchema = z.object({
  customer_name:  z.string().min(2).max(100),
  customer_phone: z.string().regex(/^\+?[\d\s\-().]{7,20}$/),
  customer_email: z.string().email().optional(),
  service_id:     z.string().uuid(),
  scheduled_at:   z.string().datetime(),
  notes:          z.string().max(500).optional(),
  channel:        z.enum(['web', 'voice', 'whatsapp', 'email']).default('web'),
})

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json()
    const parsed = CreateAppointmentSchema.parse(body)

    // Explicitly omit undefined optional fields to satisfy exactOptionalPropertyTypes
    const dto: CreateAppointmentDto = {
      customer_name:  parsed.customer_name,
      customer_phone: parsed.customer_phone,
      service_id:     parsed.service_id,
      scheduled_at:   parsed.scheduled_at,
      channel:        parsed.channel,
      ...(parsed.customer_email ? { customer_email: parsed.customer_email } : {}),
      ...(parsed.notes          ? { notes: parsed.notes }                   : {}),
    }

    const service = new AppointmentService()
    const appointment = await service.createAppointment(dto)

    return NextResponse.json({ success: true, data: appointment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: error.issues } },
        { status: 400 }
      )
    }
    const message = error instanceof Error ? error.message : 'Error interno'
    console.error('POST /api/appointments:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    )
  }
}
