import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const ServiceSchema = z.object({
  name:         z.string().min(2).max(100),
  description:  z.string().max(500).optional(),
  duration_min: z.number().int().positive(),
  price_eur:    z.number().min(0),
  active:       z.boolean().default(true),
  sort_order:   z.number().int().default(0),
})

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(req: NextRequest) {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  try {
    const body: unknown = await req.json()
    const data = ServiceSchema.parse(body)

    const db = createAdminClient()
    const { data: service, error } = await db.from('services').insert(data).select().single()
    if (error) throw error

    revalidatePath('/servicios')
    revalidatePath('/dashboard/servicios')
    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.issues } }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
