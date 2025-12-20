-- SI YA TIENES LA TABLA CREADA, EJECUTA SOLO ESTO:

-- 1. Agregar nuevas columnas
ALTER TABLE boom_sales_2026 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'yape';

ALTER TABLE boom_sales_2026 
ADD COLUMN IF NOT EXISTS payment_proof TEXT;

-- Nota: Si 'status' ya existe, esto no hará nada, pero si quieres cambiar el default:
ALTER TABLE boom_sales_2026 
ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE boom_sales_2026 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE boom_sales_2026 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

ALTER TABLE boom_sales_2026 
ADD COLUMN IF NOT EXISTS approved_by TEXT;

-- 2. Migrar datos existentes (asumir que lo anterior fue pagado/aprobado)
UPDATE boom_sales_2026 
SET status = 'approved', payment_method = 'efectivo' 
WHERE status = 'paid' OR status IS NULL;

-- 3. Habilitar permisos de actualización (para aprobar/rechazar)
CREATE POLICY "Enable update for everyone" ON boom_sales_2026 FOR UPDATE USING (true);
