import { NextResponse } from 'next/server'
import { runWhatsAppAgent } from '@/lib/services/whatsapp-agent-service'

export async function GET() {
  try {
    const reply = await runWhatsAppAgent('Hola, ¿qué servicios tenéis?', [])
    return NextResponse.json({ ok: true, reply })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
