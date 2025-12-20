-- MIGRACIÓN V3: Control de Asistencia (Check-in)

-- 1. Agregar campo para saber si ya ingresó al evento
ALTER TABLE boom_sales_2026 
ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE;

-- 2. Agregar fecha/hora de ingreso
ALTER TABLE boom_sales_2026 
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;

-- 3. Asegurar que las políticas permitan actualizar estos campos (ya cubierto por la política de UPDATE anterior, pero bueno confirmar)
-- (No se requiere acción si ya ejecutaste migration_v2.sql)
