-- Add category column to services
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category text;
