import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // Twilio sends x-www-form-urlencoded
  const formData = await req.formData()

  const from = (formData.get('From') as string | null) ?? ''
  const body = (formData.get('Body') as string | null) ?? ''

  if (!from || !body) {
    return new NextResponse('', { status: 204 })
  }

  // Strip "whatsapp:" prefix if present
  const phone = from.replace('whatsapp:', '')

  // Persist inbound message
  const db = createAdminClient()
  await db.from('whatsapp_messages').insert({
    phone,
    direction: 'in',
    body,
  })

  // n8n handles LLM response — no synchronous reply needed here
  // Twilio expects empty TwiML to not send an immediate reply
  return new NextResponse(
    '<?xml version="1.0"?><Response></Response>',
    { headers: { 'Content-Type': 'text/xml' } }
  )
}
