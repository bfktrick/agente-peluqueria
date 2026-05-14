import { NextRequest, NextResponse } from 'next/server'
import { AgentToolService } from '@/lib/services/agent-tool-service'
import type { AgentToolName } from '@/lib/services/agent-tool-service'

const VALID_TOOLS: AgentToolName[] = [
  'get_services',
  'get_available_slots',
  'request_appointment',
  'cancel_appointment',
  'get_business_info',
]

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  // Auth
  const secret = req.headers.get('x-elevenlabs-secret')
  if (secret !== process.env.ELEVENLABS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tool } = await params

  if (!VALID_TOOLS.includes(tool as AgentToolName)) {
    return NextResponse.json({ error: `Unknown tool: ${tool}` }, { status: 400 })
  }

  // ElevenLabs sends parameters as a flat JSON body
  let body: Record<string, string> = {}
  try {
    body = await req.json() as Record<string, string>
  } catch {
    // Empty body is fine for tools with no params
  }

  console.log(`[ElevenLabs] tool=${tool} params=`, JSON.stringify(body))

  try {
    const agentService = new AgentToolService()
    const result = await agentService.handle(tool as AgentToolName, body)
    console.log(`[ElevenLabs] tool=${tool} result=`, JSON.stringify(result))
    return NextResponse.json({ result })
  } catch (error) {
    console.error(`[ElevenLabs] ${tool} error:`, error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
