import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const PatchSchema = z.object({
  name:         z.string().min(2).max(100).optional(),
  description:  z.string().max(500).optional(),
  duration_min: z.number().int().positive().optional(),
  price_eur:    z.number().min(0).optional(),
  active:       z.boolean().optional(),
  sort_order:   z.number().int().optional(),
})

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  try {
    const { id } = await params
    const body: unknown = await req.json()
    const data = PatchSchema.parse(body)

    const db = createAdminClient()
    const { data: service, error } = await db
      .from('services')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/servicios')
    revalidatePath('/dashboard/servicios')
    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: error.issues } }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { id } = await params
  const db = createAdminClient()

  // Soft delete: set active=false
  const { error } = await db.from('services').update({ active: false }).eq('id', id)
  if (error) return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR' } }, { status: 500 })

  revalidatePath('/servicios')
  revalidatePath('/dashboard/servicios')
  return NextResponse.json({ success: true })
}
