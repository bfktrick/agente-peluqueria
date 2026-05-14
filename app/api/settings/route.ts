import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyToken, SESSION_COOKIE } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const Schema = z.object({
  key:   z.string().min(1),
  value: z.unknown(),
})

async function requireAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return verifyToken(token)
}

export async function POST(req: NextRequest) {
  const ok = await requireAuth()
  if (!ok) return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })

  try {
    const body: unknown = await req.json()
    const { key, value } = Schema.parse(body)

    const db = createAdminClient()
    const { error } = await db
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' })

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/dashboard/pagina')
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
