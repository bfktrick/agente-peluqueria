import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

const MAX_SIZE_BYTES = 3 * 1024 * 1024 // 3 MB
const ALLOWED_TYPES  = ['image/jpeg', 'image/png', 'image/webp']
const BUCKET         = 'gallery'

export async function POST(req: NextRequest) {
  // Auth guard — must be logged in as admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: 'Solo se aceptan imágenes JPG, PNG o WEBP' },
      { status: 400 }
    )
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { success: false, error: 'La imagen no puede superar los 3 MB' },
      { status: 400 }
    )
  }

  const ext      = file.name.split('.').pop() ?? 'jpg'
  const filename = `services/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const buffer   = Buffer.from(await file.arrayBuffer())

  const admin = createAdminClient()
  const { error } = await admin.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    console.error('Storage upload error:', error)
    return NextResponse.json({ success: false, error: 'Error al subir la imagen' }, { status: 500 })
  }

  const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(filename)

  return NextResponse.json({ success: true, url: publicUrl })
}
