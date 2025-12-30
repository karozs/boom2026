-- =====================================================
-- SCRIPT PARA ELIMINAR SOLO LAS VENTAS DE BEBIDAS
-- =====================================================
-- Este script elimina ÚNICAMENTE los registros de ventas
-- de la tabla boom_drink_sales, manteniendo intactos
-- los productos en boom_products
-- =====================================================

-- Eliminar todas las ventas de bebidas
DELETE FROM boom_drink_sales;

-- Reiniciar el contador de ID (opcional)
-- Esto hace que el próximo ID sea 1
ALTER SEQUENCE boom_drink_sales_id_seq RESTART WITH 1;

-- Verificar que se eliminaron las ventas
SELECT COUNT(*) as total_ventas_restantes FROM boom_drink_sales;

-- Verificar que los productos siguen intactos
SELECT COUNT(*) as total_productos FROM boom_products WHERE active = true;
