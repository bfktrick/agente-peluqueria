import { createAdminClient } from '@/lib/supabase/server'
import type { Appointment, CreateAppointmentDto } from '@/lib/types'

export class AppointmentRepository {
  private get db() {
    return createAdminClient()
  }

  async findAll(filters?: { status?: string }): Promise<Appointment[]> {
    let query = this.db
      .from('appointments')
      .select('*, service:services(*)')
      .order('scheduled_at', { ascending: true })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query
    if (error) throw new Error(`AppointmentRepository.findAll: ${error.message}`)
    return data as Appointment[]
  }

  async findByDate(date: Date): Promise<Appointment[]> {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    const { data, error } = await this.db
      .from('appointments')
      .select('*, service:services(*)')
      .gte('scheduled_at', start.toISOString())
      .lte('scheduled_at', end.toISOString())
      .neq('status', 'cancelled')

    if (error) throw new Error(`AppointmentRepository.findByDate: ${error.message}`)
    return data as Appointment[]
  }

  async insert(dto: CreateAppointmentDto): Promise<Appointment> {
    const { data, error } = await this.db
      .from('appointments')
      .insert({ ...dto, status: 'pending', reminder_sent: false })
      .select('*, service:services(*)')
      .single()

    if (error) throw new Error(`AppointmentRepository.insert: ${error.message}`)
    return data as Appointment
  }

  async updateStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    const { data, error } = await this.db
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select('*, service:services(*)')
      .single()

    if (error) throw new Error(`AppointmentRepository.updateStatus: ${error.message}`)
    return data as Appointment
  }

  async markReminderSent(id: string): Promise<void> {
    const { error } = await this.db
      .from('appointments')
      .update({ reminder_sent: true })
      .eq('id', id)

    if (error) throw new Error(`AppointmentRepository.markReminderSent: ${error.message}`)
  }

  async findTomorrowConfirmed(): Promise<Appointment[]> {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const apts = await this.findByDate(tomorrow)
    return apts.filter((a) => a.status === 'confirmed' && !a.reminder_sent)
  }
}
