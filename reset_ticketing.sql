-- SCRIPT PARA RESETEAR BOLETERÍA (SOLAMENTE)
-- Este script ELIMINARÁ TODAS las ventas, tickets y registros de escaneo.
-- NO afectará al Lineup ni a la Galería.

TRUNCATE TABLE boom_sales_2026 RESTART IDENTITY;
