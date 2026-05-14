import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { runWhatsAppAgent } from '@/lib/services/whatsapp-agent-service'
import type { ConversationMessage } from '@/lib/services/whatsapp-agent-service'

// New session if the last exchange was more than 4 hours ago
const SESSION_TIMEOUT_MS = 4 * 60 * 60 * 1000
// Keep only the last N message pairs to limit token usage
const HISTORY_MESSAGES = 8

function twiml(message: string) {
  const safe = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return new NextResponse(
    `<?xml version="1.0"?><Response><Message>${safe}</Message></Response>`,
    { headers: { 'Content-Type': 'text/xml' } },
  )
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const from = (formData.get('From') as string | null) ?? ''
  const body = (formData.get('Body') as string | null) ?? ''

  if (!from || !body.trim()) {
    return new NextResponse('<?xml version="1.0"?><Response></Response>', {
      headers: { 'Content-Type': 'text/xml' },
    })
  }

  const phone = from.replace('whatsapp:', '')
  const db = createAdminClient()

  // Persist inbound message
  await db.from('whatsapp_messages').insert({ phone, direction: 'in', body })

  // Load recent messages with timestamps to detect session boundaries
  const { data: rows } = await db
    .from('whatsapp_messages')
    .select('direction, body, created_at')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(HISTORY_MESSAGES + 1) // +1 to include the message we just inserted

  const allRows = (rows ?? []).reverse() // oldest first

  // Exclude the last row (the message just inserted = current user message)
  const historyRows = allRows.slice(0, -1)

  // Check for session timeout: find the most recent outbound message
  const lastOutbound = [...historyRows].reverse().find((r) => r.direction === 'out')
  const isNewSession =
    !lastOutbound ||
    Date.now() - new Date(lastOutbound.created_at as string).getTime() > SESSION_TIMEOUT_MS

  const history: ConversationMessage[] = isNewSession
    ? []
    : historyRows.map((row: { direction: string; body: string }) => ({
        role:    row.direction === 'in' ? ('user' as const) : ('assistant' as const),
        content: row.body as string,
      }))

  if (isNewSession && historyRows.length > 0) {
    console.log(`[WhatsApp] New session detected for ${phone} — clearing history`)
  }

  try {
    const reply = await runWhatsAppAgent(body, history)
    await db.from('whatsapp_messages').insert({ phone, direction: 'out', body: reply })
    return twiml(reply)
  } catch (err) {
    console.error('[Twilio webhook] agent error:', err)
    const fallback = 'Lo siento, ha ocurrido un error. Por favor, llámanos directamente.'
    await db.from('whatsapp_messages').insert({ phone, direction: 'out', body: fallback })
    return twiml(fallback)
  }
}
