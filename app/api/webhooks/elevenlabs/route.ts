import { NextRequest, NextResponse } from 'next/server'
import { AgentToolService } from '@/lib/services/agent-tool-service'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-elevenlabs-secret')
  if (secret !== process.env.ELEVENLABS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json() as { tool?: string; params?: Record<string, string> }
    const { tool, params = {} } = body

    if (!tool) {
      return NextResponse.json({ error: 'tool is required' }, { status: 400 })
    }

    const agentService = new AgentToolService()
    const result = await agentService.handle(
      tool as Parameters<AgentToolService['handle']>[0],
      params
    )

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('ElevenLabs webhook error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
