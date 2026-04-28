import { createAdminClient } from '@/lib/supabase/server'
import type { Service } from '@/lib/types'

export class ServiceRepository {
  private get db() {
    return createAdminClient()
  }

  async findAllActive(): Promise<Service[]> {
    const { data, error } = await this.db
      .from('services')
      .select('*')
      .eq('active', true)
      .order('sort_order')

    if (error) throw new Error(`ServiceRepository.findAllActive: ${error.message}`)
    return data
  }

  async findById(id: string): Promise<Service | null> {
    const { data, error } = await this.db
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }
}
