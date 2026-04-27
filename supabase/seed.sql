-- Seed AG Beauty Salon — Tarragona
-- Actualizar horarios reales y datos de contacto antes de producción

insert into public.settings (key, value) values
  ('business_hours', '{
    "mon": {"open": "09:00", "close": "19:00"},
    "tue": {"open": "09:00", "close": "19:00"},
    "wed": {"open": "09:00", "close": "19:00"},
    "thu": {"open": "09:00", "close": "19:00"},
    "fri": {"open": "09:00", "close": "19:00"},
    "sat": {"open": "09:00", "close": "14:00"},
    "sun": null
  }'),
  ('business_info', '{
    "name": "AG Beauty Salon",
    "tagline": "Tu estilo, nuestra pasión",
    "address": "Avinguda Principat d''Andorra, 10 A",
    "city": "Tarragona",
    "postal_code": "43002",
    "phone": "",
    "whatsapp": "",
    "email": "",
    "instagram": "https://www.instagram.com/agbeautysalon40/",
    "staff": [{"name": "Gustavo Castro", "role": "Barbero & fundador"}],
    "rating": 4.9,
    "reviews_count": 51
  }'),
  ('booking_config', '{
    "advance_days": 30,
    "slot_interval_min": 30,
    "min_notice_hours": 2
  }');

-- Servicios reales extraídos de Booksy (abril 2024)
insert into public.services (name, description, duration_min, price_eur, sort_order) values
  ('Corte degradado',         'Degradado clásico adaptado a tu estilo',           40,  15.00, 1),
  ('Corte degradado + barba', 'Degradado completo con arreglo de barba incluido', 60,  20.00, 2),
  ('Corte con diseño',        'Corte personalizado con diseño o líneas',           45,  16.00, 3),
  ('Corte caballero',         'Corte clásico de caballero',                        30,  12.00, 4),
  ('Recorte de barba',        'Perfilado y arreglo de barba',                      20,   8.00, 5),
  ('Diseño de barba',         'Diseño y definición completa de la barba',          30,   9.50, 6),
  ('Rapado',                  'Rapado completo al cero',                           30,  10.00, 7),
  ('Afeitado cabeza + barba', 'Afeitado total de cabeza y barba',                  30,  20.00, 8),
  ('Corte niños',             'Corte para los más pequeños',                       30,  10.00, 9),
  ('Depilación axilas',       'Depilación profesional de axilas',                  15,   6.00, 10);
