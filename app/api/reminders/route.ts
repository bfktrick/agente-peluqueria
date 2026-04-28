import { NextRequest, NextResponse } from 'next/server'
import { AppointmentRepository } from '@/lib/repositories/appointment-repository'
import { NotificationService } from '@/lib/services/notification-service'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-internal-secret')
  if (secret !== process.env.INTERNAL_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const repo = new AppointmentRepository()
  const notificationService = new NotificationService()

  const toRemind = await repo.findTomorrowConfirmed()
  let sent = 0

  for (const apt of toRemind) {
    try {
      await notificationService.sendReminder(apt)
      await repo.markReminderSent(apt.id)
      sent++
    } catch (err) {
      console.error(`Reminder failed for appointment ${apt.id}:`, err)
    }
  }

  return NextResponse.json({ success: true, data: { sent, total: toRemind.length } })
}
