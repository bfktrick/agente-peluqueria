export interface Service {
  id: string
  name: string
  description: string | null
  duration_min: number
  price_eur: number
  image_url: string | null
  active: boolean
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  brand: string | null
  price_eur: number | null
  image_url: string | null
  active: boolean
  sort_order: number
  created_at: string
}

export interface Appointment {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  service_id: string | null
  service?: Service
  notes: string | null
  scheduled_at: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  channel: 'web' | 'voice' | 'whatsapp' | 'email'
  reminder_sent: boolean
  created_at: string
}

export interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  service_id: string | null
  service?: Service
  visible: boolean
  created_at: string
}

export interface InvoiceItem {
  type: 'service' | 'product'
  name: string
  qty: number
  unit_price: number
}

export interface Invoice {
  id: string
  invoice_number: string
  appointment_id: string | null
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  items: InvoiceItem[]
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  status: 'draft' | 'issued' | 'paid' | 'cancelled'
  issued_at: string | null
  paid_at: string | null
  notes: string | null
  created_at: string
}

export interface BusinessHours {
  open: string
  close: string
  break?: { start: string; end: string }
}

export interface TimeSlot {
  datetime: string
  label: string
  available: boolean
}

export type CreateAppointmentDto = {
  customer_name: string
  customer_phone: string
  customer_email?: string
  service_id: string
  scheduled_at: string
  notes?: string
  channel?: Appointment['channel']
}
