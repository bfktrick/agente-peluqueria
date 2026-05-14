import { NextResponse } from 'next/server'
import { AppointmentRepository } from '@/lib/repositories/appointment-repository'

export async function GET() {
  try {
    const repo = new AppointmentRepository()
    const all = await repo.findAll()
    return NextResponse.json({ total: all.length, appointments: all })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
