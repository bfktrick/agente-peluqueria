# Agente WhatsApp — Configuración completa

Motor: **Anthropic Claude** (`claude-sonnet-4-6`) via API directa  
Canal: **Twilio WhatsApp Sandbox / número propio**  
Archivo principal: `lib/services/whatsapp-agent-service.ts`  
Backend de herramientas: `lib/services/agent-tool-service.ts`

---

## System Prompt

```
Eres Sofía, asistente de AG Beauty Salon (Tarragona). Atiendes WhatsApp.
Respuestas cortas. Español de España. Un emoji máximo por mensaje.

━━━ ANTES DE CADA RESPUESTA ━━━
Lee TODO el historial. Extrae lo que ya sabes:
  • servicio → si el cliente lo mencionó, ya lo tienes. NO lo preguntes de nuevo.
  • fecha    → si el cliente la mencionó, ya la tienes. NO la preguntes de nuevo.
  • horario  → si el cliente eligió uno, ya lo tienes.
  • nombre   → si el cliente lo dado, ya lo tienes.
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
• get_business_info.
```

---

## Herramientas (Tool Schemas para la API de Anthropic)

```json
[
  {
    "name": "get_services",
    "description": "Lista de servicios del salón con nombre, duración y precio.",
    "input_schema": { "type": "object", "properties": {} }
  },
  {
    "name": "get_available_slots",
    "description": "Horarios disponibles para un servicio en una fecha. Si la fecha es pasada o incorrecta, usa la más próxima disponible.",
    "input_schema": {
      "type": "object",
      "properties": {
        "service_name": { "type": "string", "description": "Nombre del servicio (ej: corte, barba, manicura)" },
        "date": { "type": "string", "description": "Fecha en formato YYYY-MM-DD. Si el cliente no especificó fecha, usa \"hoy\". Año actual: 2026." }
      },
      "required": ["service_name", "date"]
    }
  },
  {
    "name": "request_appointment",
    "description": "Crea una cita. Llama solo cuando el cliente haya elegido horario y hayas recogido nombre y teléfono.",
    "input_schema": {
      "type": "object",
      "properties": {
        "customer_name":  { "type": "string", "description": "Nombre completo del cliente" },
        "customer_phone": { "type": "string", "description": "Teléfono del cliente" },
        "service_name":   { "type": "string", "description": "Nombre del servicio" },
        "scheduled_at":   { "type": "string", "description": "Valor \"datetime\" exacto devuelto por get_available_slots" }
      },
      "required": ["customer_name", "customer_phone", "service_name", "scheduled_at"]
    }
  },
  {
    "name": "cancel_appointment",
    "description": "Cancela la próxima cita activa del cliente.",
    "input_schema": {
      "type": "object",
      "properties": {
        "customer_phone": { "type": "string", "description": "Teléfono con el que se hizo la reserva" }
      },
      "required": ["customer_phone"]
    }
  },
  {
    "name": "get_business_info",
    "description": "Información del negocio: dirección, horario, teléfono, etc.",
    "input_schema": { "type": "object", "properties": {} }
  }
]
```

---

## Parámetros del modelo

| Parámetro    | Valor              | Nota                                               |
|---|---|---|
| `model`      | `claude-sonnet-4-6` | No usar Haiku — alucina confirmaciones sin llamar tools |
| `max_tokens` | `1024`             | Suficiente para respuestas de WhatsApp              |
| `system`     | Ver arriba         |                                                    |
| `tools`      | Ver arriba         |                                                    |

---

## Gestión de sesión y historial

- **Timeout de sesión:** 4 horas sin respuesta del negocio → historial limpio
- **Límite de historial:** últimos 8 mensajes (4 pares usuario/asistente)
- **Lógica de sesión:** se detecta mirando el timestamp del último mensaje saliente (`direction = 'out'`)

```
Si (ahora - última respuesta del bot) > 4h → history = []
Si no → history = últimas 8 filas de whatsapp_messages para ese teléfono
```

Tabla en Supabase: `whatsapp_messages (phone, direction, body, created_at)`

---

## Webhook Twilio

**URL:** `POST /api/webhooks/twilio`  
**Formato entrada:** `application/x-www-form-urlencoded`  
**Campos relevantes:**
- `From` → número del cliente (incluye prefijo `whatsapp:`)
- `Body` → texto del mensaje

**Formato de respuesta:** TwiML
```xml
<?xml version="1.0"?>
<Response>
  <Message>Texto de respuesta aquí</Message>
</Response>
```

---

## Adaptación a otro negocio

1. Cambiar el nombre del agente en el system prompt (`Sofía` → otro nombre)
2. Cambiar el nombre del negocio y ciudad
3. Los precios/servicios/horarios vienen de la BD → no hay que tocar el prompt
4. Ajustar `SESSION_TIMEOUT_MS` y `HISTORY_MESSAGES` según volumen esperado
5. El `channel` guardado en la cita es `'whatsapp'` — cambiarlo si hace falta
