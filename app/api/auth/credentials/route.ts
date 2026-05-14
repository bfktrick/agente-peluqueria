import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/server'
import { hashPassword, verifyToken, SESSION_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  // Verificar sesión activa
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!verifyToken(token)) {
    return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const { email, password } = await req.json() as { email: string; password: string }

    if (!email || email.length < 3 || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Email no válido' }, { status: 400 })
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const db = createAdminClient()
    await Promise.all([
      db.from('settings').upsert({ key: 'admin_email',         value: email                 }, { onConflict: 'key' }),
      db.from('settings').upsert({ key: 'admin_password_hash', value: hashPassword(password) }, { onConflict: 'key' }),
    ])

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
