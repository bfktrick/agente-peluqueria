import { createAdminClient } from '@/lib/supabase/server'
import type { BusinessHours } from '@/lib/types'

type BusinessHoursMap = Record<string, BusinessHours | null>

export class SettingsRepository {
  private get db() {
    return createAdminClient()
  }

  async get(key: string): Promise<unknown> {
    const { data, error } = await this.db
      .from('settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error) throw new Error(`SettingsRepository.get(${key}): ${error.message}`)
    return data.value
  }

  async getBusinessHours(): Promise<BusinessHoursMap> {
    return this.get('business_hours') as Promise<BusinessHoursMap>
  }

  async getBookingConfig(): Promise<{ advance_days: number; slot_interval_min: number; min_notice_hours: number }> {
    return this.get('booking_config') as Promise<{
      advance_days: number
      slot_interval_min: number
      min_notice_hours: number
    }>
  }
}
