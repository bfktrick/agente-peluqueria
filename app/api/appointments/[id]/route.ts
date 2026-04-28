import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { AppointmentService } from '@/lib/services/appointment-service'

const PatchSchema = z.object({
  status: z.enum(['confirmed', 'cancelled', 'completed']),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED' } },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const body: unknown = await req.json()
    const { status } = PatchSchema.parse(body)

    const service = new AppointmentService()
    const updated = await service.updateStatus(id, status)

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: error.issues } },
        { status: 400 }
      )
    }
    console.error('PATCH /api/appointments/[id]:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
