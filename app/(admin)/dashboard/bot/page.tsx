import { createAdminClient } from '@/lib/supabase/server'
import { BotAdmin } from '@/components/admin/bot-admin'

export default async function BotPage() {
  const db = createAdminClient()
  const { data } = await db
    .from('settings')
    .select('value')
    .eq('key', 'whatsapp_number')
    .single()

  const whatsappNumber = (data?.value as string | null) ?? ''

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-10">
        <span className="label-sm block mb-2" style={{ color: 'var(--color-green-sage)' }}>Admin</span>
        <h1 className="font-serif text-3xl text-white">Bot &amp; Canales</h1>
      </div>

      <BotAdmin whatsappNumber={whatsappNumber} />
    </div>
  )
}
