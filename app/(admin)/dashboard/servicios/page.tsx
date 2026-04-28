import { createAdminClient } from '@/lib/supabase/server'
import { ServicesAdmin } from '@/components/admin/services-admin'
import type { Service } from '@/lib/types'

export default async function ServiciosAdminPage() {
  const db = createAdminClient()
  const { data } = await db
    .from('services')
    .select('*')
    .order('sort_order')

  const services: Service[] = data ?? []

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="heading-md mb-1">Servicios</h1>
        <p className="body-sm">Gestiona los servicios del catálogo</p>
      </div>
      <ServicesAdmin services={services} />
    </div>
  )
}
