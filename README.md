# 🎉 BOOM! 2026 - New Year Festival

Sitio web oficial del evento BOOM! 2026 en Pampas, Huancavelica.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 📦 Configuración de Base de Datos

### Paso 1: Ejecutar Script de Configuración
Ejecuta el archivo `database_setup.sql` en tu panel de Supabase (SQL Editor):

```sql
-- Este script configura:
-- ✅ Tabla de ventas (boom_sales_2026)
-- ✅ Tabla de lineup (boom_lineup)
-- ✅ Tabla de galería (boom_gallery)
-- ✅ Índices para optimización
-- ✅ Políticas de seguridad (RLS)
-- ✅ Storage bucket para imágenes
```

### Paso 2: Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## 🎫 Funcionalidades

### Público
- ✨ Página principal con información del evento
- 🎵 Lineup de géneros musicales
- 🖼️ Galería de fotos
- 🎟️ Sistema de compra de tickets (GENERAL, VIP, BOOM EXP)
- 💳 Pago por Yape o Efectivo
- 📧 Confirmación por email

### Panel de Administración
**URL:** `/admin`  
**Contraseña:** `admin2026`

- 📊 Dashboard con estadísticas
- ✅ Aprobación/Rechazo de órdenes
- 🎫 Generación de tickets digitales
- 📱 Escáner QR para entrada
- 🖼️ Gestor de contenido (Lineup y Galería)
- 👥 Registro de integrantes de grupo (VIP/BOOM EXP)

## 🗂️ Estructura del Proyecto

```
AñoNuevoFest/
├── src/
│   ├── components/       # Componentes React
│   ├── lib/             # Configuración Supabase
│   └── App.jsx          # Componente principal
├── public/              # Archivos estáticos
├── database_setup.sql   # Script de configuración DB
├── reset_ticketing.sql  # Script para resetear ventas
└── README.md           # Este archivo
```

## 🎨 Tipos de Tickets

1. **GENERAL** - S/ 0 (Gratis si vienes solo)
   - Acceso libre
   - Cubículo instagrameable
   - Accesorios temáticos
   - Shot de cortesía

2. **VIP** - S/ 50 (Máx 5 personas)
   - Todo lo de GENERAL
   - 50% OFF 1ra Botella (Flor de Caña) o Cóctel
   - Pulseras

3. **BOOM EXP** - S/ 70 (Máx 5 personas)
   - Todo lo de GENERAL
   - Botella de Cortesía + Shot French 75
   - Pulseras

## 🔧 Optimizaciones Aplicadas

- ⚡ Consultas SQL optimizadas con límite de 500 registros
- 📊 Selección específica de columnas (no SELECT *)
- 🗂️ Índices en campos frecuentemente consultados
- 🚀 Eliminación de archivos SQL obsoletos
- 💾 Caching de datos en el admin

## 📝 Scripts Útiles

### Resetear Ventas
```bash
# Ejecutar reset_ticketing.sql en Supabase
# ADVERTENCIA: Esto eliminará TODAS las ventas
```

## 🌐 Despliegue

El proyecto está configurado para Vercel:

```bash
npm run build
# Subir carpeta dist/ a Vercel
```

## 📞 Soporte

Para consultas sobre el evento:
- 📱 WhatsApp: 977 163 359
- 📍 Ubicación: Ciudad Pampas - Huancavelica

---

**Desarrollado para BOOM! 2026** 🎊
