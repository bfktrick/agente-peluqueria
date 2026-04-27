-- Row Level Security para AG Beauty Salon

alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.appointments enable row level security;
alter table public.settings enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.reviews enable row level security;
alter table public.invoices enable row level security;

-- Servicios: lectura pública (solo activos), escritura solo service_role
create policy "services_public_read" on public.services
  for select using (active = true);
create policy "services_admin_all" on public.services
  for all using (auth.role() = 'service_role');

-- Productos: igual que servicios
create policy "products_public_read" on public.products
  for select using (active = true);
create policy "products_admin_all" on public.products
  for all using (auth.role() = 'service_role');

-- Citas: solo service_role
create policy "appointments_service_role_only" on public.appointments
  for all using (auth.role() = 'service_role');

-- Settings: lectura pública, escritura solo service_role
create policy "settings_public_read" on public.settings
  for select using (true);
create policy "settings_service_role_write" on public.settings
  for all using (auth.role() = 'service_role');

-- WhatsApp: solo service_role
create policy "whatsapp_service_role_only" on public.whatsapp_messages
  for all using (auth.role() = 'service_role');

-- Reseñas: lectura pública solo visibles, escritura service_role
create policy "reviews_public_read" on public.reviews
  for select using (visible = true);
create policy "reviews_public_insert" on public.reviews
  for insert with check (true);
create policy "reviews_admin_all" on public.reviews
  for all using (auth.role() = 'service_role');

-- Facturas: solo service_role
create policy "invoices_service_role_only" on public.invoices
  for all using (auth.role() = 'service_role');
