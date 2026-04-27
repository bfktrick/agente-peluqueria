-- AG Beauty Salon — Migración inicial
create extension if not exists "uuid-ossp";

-- Settings
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_min int not null check (duration_min > 0),
  price_eur numeric(6,2) not null check (price_eur >= 0),
  image_url text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  brand text,
  price_eur numeric(6,2) check (price_eur >= 0),
  image_url text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- Appointments
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  service_id uuid references public.services(id) on delete restrict,
  notes text,
  scheduled_at timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  channel text not null default 'web'
    check (channel in ('web', 'voice', 'whatsapp', 'email')),
  reminder_sent boolean not null default false,
  created_at timestamptz default now()
);

-- WhatsApp message history
create table public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  direction text not null check (direction in ('in', 'out')),
  body text not null,
  created_at timestamptz default now()
);

-- Reviews (moderated before publishing)
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  service_id uuid references public.services(id) on delete set null,
  visible boolean not null default false,
  created_at timestamptz default now()
);

-- Invoices
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  appointment_id uuid references public.appointments(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  items jsonb not null default '[]',
  subtotal numeric(8,2) not null default 0,
  tax_rate numeric(4,2) not null default 21,
  tax_amount numeric(8,2) not null default 0,
  total numeric(8,2) not null default 0,
  status text not null default 'draft'
    check (status in ('draft', 'issued', 'paid', 'cancelled')),
  issued_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- Índices
create index appointments_status_idx on public.appointments(status);
create index appointments_scheduled_at_idx on public.appointments(scheduled_at);
create index appointments_customer_phone_idx on public.appointments(customer_phone);
create index whatsapp_messages_phone_idx on public.whatsapp_messages(phone);
create index invoices_status_idx on public.invoices(status);
create index reviews_visible_idx on public.reviews(visible);
