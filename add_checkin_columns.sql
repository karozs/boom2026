-- Migration to add check-in tracking columns to boom_sales_2026 table
ALTER TABLE boom_sales_2026 ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;
ALTER TABLE boom_sales_2026 ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;
