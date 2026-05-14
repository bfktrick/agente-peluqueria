import { NextRequest, NextResponse } from 'next/server'
import { AgentToolService } from '@/lib/services/agent-tool-service'
import type { AgentToolName } from '@/lib/services/agent-tool-service'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-elevenlabs-secret')
  if (secret !== process.env.ELEVENLABS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json() as Record<string, unknown>

    console.log('[ElevenLabs webhook] body:', JSON.stringify(body, null, 2))

    // ElevenLabs can send the tool name in different fields depending on config
    const tool = (
      body.tool ?? body.name ?? body.tool_name ?? body.function_name
    ) as string | undefined

    // Params can come as "params", "parameters", or "arguments"
    const params = (
      body.params ?? body.parameters ?? body.arguments ?? {}
    ) as Record<string, string>

    if (!tool) {
      return NextResponse.json({ error: 'tool name not found in request' }, { status: 400 })
    }

    const agentService = new AgentToolService()
    const result = await agentService.handle(tool as AgentToolName, params)

    // ElevenLabs expects the response in "result" or "data"
    return NextResponse.json({ result, data: result })
  } catch (error) {
    console.error('[ElevenLabs webhook] error:', error)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
