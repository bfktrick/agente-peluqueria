import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth'

export async function POST() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const res = NextResponse.redirect(new URL('/login', appUrl))
  res.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' })
  return res
}
