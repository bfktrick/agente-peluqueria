import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { hashPassword, makeToken, SESSION_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as { email: string; password: string }

    if (!email || !password) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const db = createAdminClient()
    const [{ data: emailRow }, { data: hashRow }] = await Promise.all([
      db.from('settings').select('value').eq('key', 'admin_email').single(),
      db.from('settings').select('value').eq('key', 'admin_password_hash').single(),
    ])

    const storedEmail = (emailRow?.value as string | null) ?? process.env.ADMIN_EMAIL ?? ''
    const storedHash  = (hashRow?.value  as string | null) ?? hashPassword(process.env.ADMIN_PASSWORD ?? '')

    if (!storedEmail || email !== storedEmail || hashPassword(password) !== storedHash) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    const token = makeToken(email)
    const res = NextResponse.json({ success: true })
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
