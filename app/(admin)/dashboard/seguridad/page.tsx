import { createAdminClient } from '@/lib/supabase/server'
import { CredentialsForm } from '@/components/admin/credentials-form'

export default async function SeguridadPage() {
  const db = createAdminClient()
  const { data } = await db
    .from('settings')
    .select('value')
    .eq('key', 'admin_email')
    .single()

  const currentEmail = (data?.value as string | null) ?? process.env.ADMIN_EMAIL ?? ''

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-10">
        <span className="label-sm block mb-2" style={{ color: 'var(--color-green-sage)' }}>Admin</span>
        <h1 className="font-serif text-3xl text-white">Seguridad</h1>
      </div>

      <CredentialsForm currentEmail={currentEmail} />
    </div>
  )
}
