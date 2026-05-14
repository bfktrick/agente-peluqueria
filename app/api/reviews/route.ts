import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const CreateSchema = z.object({
  customer_name: z.string().min(1).max(100),
  rating:        z.number().int().min(1).max(5),
  comment:       z.string().max(2000).optional(),
  service_name:  z.string().max(100).optional(),
  source:        z.enum(['google', 'booksy', 'manual']).default('manual'),
  visible:       z.boolean().default(true),
})

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const db = createAdminClient()
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .eq('visible', true)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(req: NextRequest) {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })

  try {
    const body: unknown = await req.json()
    const data = CreateSchema.parse(body)

    const db = createAdminClient()
    const { data: review, error } = await db
      .from('reviews')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/dashboard/opiniones')
    return NextResponse.json({ success: true, data: review }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
