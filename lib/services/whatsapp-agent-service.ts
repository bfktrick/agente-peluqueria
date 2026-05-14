import Anthropic from '@anthropic-ai/sdk'
import { AgentToolService } from '@/lib/services/agent-tool-service'
import type { AgentToolName } from '@/lib/services/agent-tool-service'

const SYSTEM_PROMPT = `Eres Sofía, asistente de AG Beauty Salon (Tarragona). Atiendes WhatsApp.
Respuestas cortas. Español de España. Un emoji máximo por mensaje.

━━━ ANTES DE CADA RESPUESTA ━━━
Lee TODO el historial. Extrae lo que ya sabes:
  • servicio → si el cliente lo mencionó, ya lo tienes. NO lo preguntes de nuevo.
  • fecha    → si el cliente la mencionó, ya la tienes. NO la preguntes de nuevo.
  • horario  → si el cliente eligió uno, ya lo tienes.
  • nombre   → si el cliente lo dio, ya lo tienes.
  • teléfono → si el cliente lo dio, ya lo tienes.

━━━ FLUJO DE RESERVA ━━━
Con servicio + fecha → llama a get_available_slots INMEDIATAMENTE. No preguntes nada más.
Con servicio sin fecha → usa "hoy" como fecha y llama a get_available_slots.
Con horario elegido pero sin nombre/teléfono → pídelos en un solo mensaje.
Con todo (servicio, horario, nombre, teléfono) → llama a request_appointment INMEDIATAMENTE.

━━━ REGLAS CRÍTICAS ━━━
• NUNCA repitas una pregunta que ya fue respondida en el historial.
• NUNCA digas "tu cita está reservada" sin antes llamar a request_appointment y recibir una respuesta de éxito.
• NUNCA llames a get_available_slots si ya tienes un horario confirmado por el cliente.
• Si el cliente da servicio, fecha, horario, nombre y teléfono en un solo mensaje → llama a request_appointment directamente.
• Si en el historial ya aparece una confirmación de cita exitosa (request_appointment devolvió éxito), la conversación está CERRADA. Responde "gracias", "hasta pronto" o similar y NO llames a ninguna herramienta. No vuelvas a comprobar disponibilidad.
• Si el usuario dice "gracias", "ok", "vale", "perfecto", "hasta luego" tras una cita confirmada → despídete con una sola frase y no uses ninguna herramienta.

━━━ OTROS FLUJOS ━━━
Cancelar: pide teléfono → cancel_appointment → confirma.
Precios/servicios: get_services. Nunca inventes precios.
Info del negocio: get_business_info.

━━━ HERRAMIENTAS ━━━
• get_services → lista de servicios.
• get_available_slots(service_name, date) — date en YYYY-MM-DD, año 2026. Devuelve slots con "time" y "datetime".
• request_appointment(customer_name, customer_phone, service_name, scheduled_at) — scheduled_at = valor "datetime" exacto del slot.
• cancel_appointment(customer_phone).
• get_business_info.`

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'get_services',
    description: 'Lista de servicios del salón con nombre, duración y precio.',
    input_schema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'get_available_slots',
    description: 'Horarios disponibles para un servicio en una fecha. Si la fecha es pasada o incorrecta, usa la más próxima disponible.',
    input_schema: {
      type: 'object' as const,
      properties: {
        service_name: { type: 'string', description: 'Nombre del servicio (ej: corte, barba, manicura)' },
        date: { type: 'string', description: 'Fecha en formato YYYY-MM-DD. Si el cliente no especificó fecha, usa "hoy". Año actual: 2026.' },
      },
      required: ['service_name', 'date'],
    },
  },
  {
    name: 'request_appointment',
    description: 'Crea una cita. Llama solo cuando el cliente haya elegido horario y hayas recogido nombre y teléfono.',
    input_schema: {
      type: 'object' as const,
      properties: {
        customer_name:  { type: 'string', description: 'Nombre completo del cliente' },
        customer_phone: { type: 'string', description: 'Teléfono del cliente' },
        service_name:   { type: 'string', description: 'Nombre del servicio' },
        scheduled_at:   { type: 'string', description: 'Valor "datetime" exacto devuelto por get_available_slots' },
      },
      required: ['customer_name', 'customer_phone', 'service_name', 'scheduled_at'],
    },
  },
  {
    name: 'cancel_appointment',
    description: 'Cancela la próxima cita activa del cliente.',
    input_schema: {
      type: 'object' as const,
      properties: {
        customer_phone: { type: 'string', description: 'Teléfono con el que se hizo la reserva' },
      },
      required: ['customer_phone'],
    },
  },
  {
    name: 'get_business_info',
    description: 'Información del negocio: dirección, horario, teléfono, etc.',
    input_schema: { type: 'object' as const, properties: {} },
  },
]

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function runWhatsAppAgent(
  userMessage: string,
  history: ConversationMessage[],
): Promise<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const toolService = new AgentToolService()

  // Build message list: history (already includes current message from DB) + new user message
  const messages: Anthropic.MessageParam[] = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: userMessage },
  ]

  let response = await anthropic.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 1024,
    system:     SYSTEM_PROMPT,
    tools:      TOOLS,
    messages,
  })

  // Agentic loop: keep running while Claude wants to use tools
  while (response.stop_reason === 'tool_use') {
    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    )

    const toolResults: Anthropic.ToolResultBlockParam[] = []

    for (const toolUse of toolUseBlocks) {
      console.log(`[WhatsApp] tool=${toolUse.name} input=`, JSON.stringify(toolUse.input))
      try {
        const result = await toolService.handle(
          toolUse.name as AgentToolName,
          toolUse.input as Record<string, string>,
        )
        console.log(`[WhatsApp] tool=${toolUse.name} result=`, JSON.stringify(result))
        toolResults.push({
          type:        'tool_result',
          tool_use_id: toolUse.id,
          content:     JSON.stringify(result),
        })
      } catch (err) {
        console.error(`[WhatsApp] tool=${toolUse.name} error:`, err)
        toolResults.push({
          type:        'tool_result',
          tool_use_id: toolUse.id,
          content:     JSON.stringify({ error: String(err) }),
          is_error:    true,
        })
      }
    }

    messages.push({ role: 'assistant', content: response.content })
    messages.push({ role: 'user',      content: toolResults })

    response = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      tools:      TOOLS,
      messages,
    })
  }

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
  return textBlock?.text ?? 'Lo siento, no pude procesar tu mensaje. Inténtalo de nuevo.'
}
