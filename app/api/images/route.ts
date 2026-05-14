import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const Schema = z.discriminatedUnion('key', [
  z.object({ key: z.literal('experience_image'), value: z.string().url() }),
  z.object({ key: z.literal('gallery_images'),   value: z.array(z.string().url()) }),
])

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(req: NextRequest) {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })

  try {
    const body: unknown = await req.json()
    const { key, value } = Schema.parse(body)

    const db = createAdminClient()
    const { error } = await db
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' })

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/dashboard/imagenes')
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
