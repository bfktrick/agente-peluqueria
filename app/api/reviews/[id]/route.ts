import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
  if (!user) return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })

  const { id } = await params
  const body = await req.json() as { visible?: boolean }

  const db = createAdminClient()
  const { error } = await db.from('reviews').update(body).eq('id', id)
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  revalidatePath('/')
  revalidatePath('/dashboard/opiniones')
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })

  const { id } = await params
  const db = createAdminClient()
  const { error } = await db.from('reviews').delete().eq('id', id)
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  revalidatePath('/')
  revalidatePath('/dashboard/opiniones')
  return NextResponse.json({ success: true })
}
