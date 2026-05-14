# Agente de Voz ElevenLabs — Configuración completa

Motor: **ElevenLabs Conversational AI**  
Canal: **Llamadas telefónicas** (vía número Twilio vinculado a ElevenLabs)  
Webhook receptor: `app/api/webhooks/elevenlabs/[tool]/route.ts`  
Backend de herramientas: `lib/services/agent-tool-service.ts`

---

## System Prompt (pegar en el panel de ElevenLabs → Agent → Prompt)

```
Eres Sofía, asistente telefónica de AG Beauty Salon en Tarragona.
Habla siempre en español de España, tono profesional y cálido.
Respuestas breves y naturales, como en una llamada real.

━━━ FLUJO DE RESERVA ━━━
1. Pregunta qué servicio quiere el cliente.
2. Pregunta qué día prefiere.
3. Llama a get_available_slots para consultar disponibilidad real.
4. Ofrece los horarios disponibles (máx 3 opciones).
5. Cuando el cliente elija un horario, pide su nombre completo y teléfono.
6. Llama a request_appointment con todos los datos.
7. Confirma la cita en voz alta con el día, hora y servicio.

━━━ REGLAS CRÍTICAS ━━━
• NUNCA inventes precios, horarios ni disponibilidad.
• NUNCA confirmes una cita sin haber llamado a request_appointment y recibido éxito.
• NUNCA preguntes nombre/teléfono antes de que el cliente haya elegido un horario.
• Si request_appointment devuelve error → comunica el problema y ofrece alternativa.
• Usa SIEMPRE el valor "datetime" exacto que devuelve get_available_slots al llamar request_appointment.

━━━ OTROS FLUJOS ━━━
• Precios/servicios: llama a get_services. Nunca inventes precios.
• Información del negocio (dirección, horario de apertura): llama a get_business_info.
• Cancelación: pide el teléfono con el que se hizo la reserva → llama a cancel_appointment.

━━━ CIERRE DE LLAMADA ━━━
• Tras confirmar una cita: "Perfecto, queda anotado. ¡Hasta el [día]!"
• Frases de cierre reconocidas: "adiós", "hasta luego", "gracias", "ya está".
```

---

## Configuración del agente en ElevenLabs

| Campo               | Valor                                  |
|---|---|
| **Nombre**          | Sofía — AG Beauty Salon                |
| **Idioma**          | Spanish (es)                           |
| **Voz**             | Voz española femenina (ej: "Sofia" o "Mia") |
| **First message**   | `Hola, buenas, AG Beauty Salon, ¿en qué le puedo ayudar?` |
| **End call phrases**| `adiós`, `hasta luego`, `cuelga`, `hasta pronto` |

---

## Herramientas (Tools en el panel de ElevenLabs)

Cada tool es de tipo **Webhook**. Configurar así:

### Header común (en todas las tools)
```
x-elevenlabs-secret: agbeauty-el-secret-2026
```

---

### Tool 1 — get_services

| Campo       | Valor                                                        |
|---|---|
| **Nombre**  | `get_services`                                               |
| **URL**     | `https://TU-DOMINIO.vercel.app/api/webhooks/elevenlabs/get_services` |
| **Método**  | POST                                                         |
| **Body**    | *(vacío)*                                                    |

Descripción para ElevenLabs:
```
Lista todos los servicios disponibles del salón con nombre, duración en minutos y precio en euros.
Usar cuando el cliente pregunte por precios, servicios o qué se puede hacer en el salón.
```

---

### Tool 2 — get_available_slots

| Campo       | Valor                                                              |
|---|---|
| **Nombre**  | `get_available_slots`                                              |
| **URL**     | `https://TU-DOMINIO.vercel.app/api/webhooks/elevenlabs/get_available_slots` |
| **Método**  | POST                                                               |

Body (JSON):
```json
{
  "service_name": "{{service_name}}",
  "date": "{{date}}"
}
```

Parámetros a declarar en ElevenLabs:
- `service_name` (string, requerido) — Nombre del servicio que quiere el cliente
- `date` (string, requerido) — Fecha en formato YYYY-MM-DD. Año actual: 2026. Si el cliente dice "mañana" o "el lunes", conviértelo a YYYY-MM-DD.

Descripción para ElevenLabs:
```
Consulta los horarios disponibles para un servicio en una fecha concreta.
Devuelve una lista de slots con "time" (hora legible) y "datetime" (ISO 8601 para usar en request_appointment).
Si la fecha está en el pasado o es incorrecta, el sistema usa la próxima disponible automáticamente.
```

---

### Tool 3 — request_appointment

| Campo       | Valor                                                                |
|---|---|
| **Nombre**  | `request_appointment`                                                |
| **URL**     | `https://TU-DOMINIO.vercel.app/api/webhooks/elevenlabs/request_appointment` |
| **Método**  | POST                                                                 |

Body (JSON):
```json
{
  "customer_name": "{{customer_name}}",
  "customer_phone": "{{customer_phone}}",
  "service_name": "{{service_name}}",
  "scheduled_at": "{{scheduled_at}}"
}
```

Parámetros:
- `customer_name` (string, requerido) — Nombre completo del cliente
- `customer_phone` (string, requerido) — Teléfono del cliente
- `service_name` (string, requerido) — Nombre del servicio
- `scheduled_at` (string, requerido) — Valor "datetime" EXACTO devuelto por get_available_slots. No construir manualmente.

Descripción para ElevenLabs:
```
Crea la cita en el sistema. Llamar solo cuando el cliente haya confirmado un horario concreto
y se hayan recogido nombre y teléfono. El campo scheduled_at debe ser el valor "datetime" exacto
que devolvió get_available_slots, nunca construirlo manualmente.
```

---

### Tool 4 — cancel_appointment

| Campo       | Valor                                                                |
|---|---|
| **Nombre**  | `cancel_appointment`                                                 |
| **URL**     | `https://TU-DOMINIO.vercel.app/api/webhooks/elevenlabs/cancel_appointment` |
| **Método**  | POST                                                                 |

Body (JSON):
```json
{
  "customer_phone": "{{customer_phone}}"
}
```

Parámetros:
- `customer_phone` (string, requerido) — Teléfono con el que se hizo la reserva

---

### Tool 5 — get_business_info

| Campo       | Valor                                                              |
|---|---|
| **Nombre**  | `get_business_info`                                                |
| **URL**     | `https://TU-DOMINIO.vercel.app/api/webhooks/elevenlabs/get_business_info` |
| **Método**  | POST                                                               |
| **Body**    | *(vacío)*                                                          |

---

## Autenticación del webhook

El webhook verifica el header `x-elevenlabs-secret` contra la variable de entorno `ELEVENLABS_WEBHOOK_SECRET`.

```
# .env.local
ELEVENLABS_WEBHOOK_SECRET=agbeauty-el-secret-2026
```

Peticiones sin el header correcto reciben `401 Unauthorized`.

---

## Vinculación con Twilio (para llamadas reales)

1. En ElevenLabs → **Phone Numbers** → **Add number**
2. Seleccionar **Import from Twilio**
3. Introducir `Account SID` y `Auth Token` de Twilio
4. Seleccionar el número de Twilio comprado
5. Asignar este agente al número

Coste orientativo: ~1,5 €/mes por el número Twilio + minutos ElevenLabs según plan.

---

## Variable de entorno necesaria

```bash
ELEVENLABS_WEBHOOK_SECRET=tu-secreto-aqui
```

---

## Respuesta del webhook

ElevenLabs espera recibir el resultado en el campo `result`:

```json
{ "result": { ... datos de la herramienta ... } }
```

El webhook en `[tool]/route.ts` ya lo devuelve en este formato.

---

## Adaptación a otro negocio

1. Cambiar nombre y ciudad en el system prompt
2. Cambiar `First message` en el panel de ElevenLabs
3. Cambiar la voz si se quiere un perfil diferente
4. Reemplazar `TU-DOMINIO.vercel.app` por el dominio real en todas las URLs de tools
5. Cambiar el valor de `ELEVENLABS_WEBHOOK_SECRET` y actualizarlo en el header de cada tool
6. Los servicios, precios y horarios se adaptan solos desde la BD — no hay nada más que tocar
