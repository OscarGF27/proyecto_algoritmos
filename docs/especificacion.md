# Contraentrega Ya - Especificación funcional y técnica

## 1) Alcance
- País/moneda: **Colombia - COP**.
- Roles: **ADMIN, OPERADOR, CLIENTE**.
- Módulos incluidos: autenticación, cotizador, órdenes, tracking, pagos/recaudos, liquidaciones y administración de catálogo (ciudades/tarifas/usuarios).
- Integraciones logísticas: **simuladas** mediante tarifas configurables.

## 2) Flujo de usuario
1. Usuario se registra o inicia sesión.
2. Cliente cotiza envío (origen/destino, peso/dimensiones, valor declarado, servicio).
3. Cliente crea orden de envío con datos de remitente/destinatario y valor contraentrega.
4. Operador/administrador actualiza eventos de estado (tracking interno).
5. Operador registra recaudo cuando orden se entrega.
6. Admin consulta reporte y liquidaciones.

## 3) Diagrama simple
```mermaid
flowchart LR
A[Landing] --> B[Auth]
B --> C[Cotizador]
C --> D[Crear Orden]
D --> E[Gestión de Estados]
E --> F[Recaudos]
F --> G[Reporte y Liquidaciones]
H[Admin Tarifas/Ciudades/Usuarios] --> C
H --> D
```

## 4) Arquitectura
- Frontend + Backend: Next.js App Router + Route Handlers.
- Persistencia: PostgreSQL con Prisma ORM.
- Seguridad:
  - Hash de password con bcrypt.
  - Validación de payload con Zod.
  - Guard por roles en endpoints.
  - Rate limit básico para login (en memoria).
  - Respuestas sanitizadas (sin hash).
- Auditoría simple:
  - cambios de tarifas y estados en `audit_logs`.

## 5) Reglas de negocio (default configurables)
- Peso volumétrico = `(largo * ancho * alto) / 5000`.
- Peso facturable = máximo entre peso real y volumétrico.
- Seguro = `max(valorDeclarado * 1%, COP 3.000)`.
- Recaudo = `(valorContraentrega * 1.5%) + COP 2.000`.
- Comisión plataforma = `5%` sobre flete (configurable sobre total).

## 6) Endpoints principales
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me`
- `POST /api/quote`
- `GET/POST /api/orders`
- `GET/DELETE /api/orders/:id`
- `POST /api/orders/:id/events`
- `GET/POST /api/admin/rates`
- `PUT/DELETE /api/admin/rates/:id`
- `GET/POST /api/admin/cities`
- `PUT/DELETE /api/admin/cities/:id`
- `GET/POST /api/admin/users`
- `PUT/DELETE /api/admin/users/:id`
- `POST /api/payments/collect`
- `GET /api/payments/report?from&to`

## 7) Estructura de carpetas
```txt
app/
  api/
  auth/
  app/
components/
lib/
prisma/
tests/
docs/
```

## 8) Guía de instalación local y despliegue
1. Crear `.env`:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/contraentrega"
NEXTAUTH_SECRET="supersecreto"
NEXTAUTH_URL="http://localhost:3000"
```
2. Instalar dependencias:
```bash
npm install
```
3. Generar Prisma client y migrar:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```
4. Ejecutar app:
```bash
npm run dev
```
5. Probar login:
- admin@contraentregaya.co / Admin123*
- operador@contraentregaya.co / Operador123*
- cliente@contraentregaya.co / Cliente123*

6. Probar cotización:
- Ir a `/app/cotizador` y usar ciudades seed:
  - `medellín-antioquia` → `bogotá-cundinamarca`

## 9) Checklist manual
- [ ] Registro usuario nuevo.
- [ ] Login válido e inválido (y rate limit).
- [ ] Cotización con estándar y express.
- [ ] Crear orden y ver estado inicial.
- [ ] Actualizar evento de estado como operador.
- [ ] Registrar recaudo y consultar reporte.
- [ ] CRUD ciudades/tarifas/usuarios con rol ADMIN.
