-- Migration to add 'attendees' column to boom_sales_2026 table
ALTER TABLE boom_sales_2026 ADD COLUMN IF NOT EXISTS attendees TEXT;
