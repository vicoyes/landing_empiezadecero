# Sistema de Referidos y Comisiones — Base de Datos (Supabase)

## 📌 Objetivo
Este esquema de base de datos soporta un **programa de referidos** donde:
- **Usuarios (conectores/comerciales)** refieren **clientes (leads)**.
- Las **comisiones son configurables por perfil** (desde dashboard).
- Las comisiones se liberan por **hitos (milestones)** según los pagos acumulados del cliente.
- Se evita la **duplicación de clientes y comisiones** (regla principal: **DNI único**).

---

## 🧠 Conceptos clave
- **Usuario / Conector**: vive en `users`.
- **Cliente referido (lead)**: vive en `referrals` (no es usuario).
- **Perfil** (`users.perfil`): define qué plan de comisión aplica (`Conector`, `Conector Pro`, `Comercial`).
- **Plan de comisión**: vive en `commission_plans` y es editable desde dashboard.
- **Milestones del plan**: viven en `commission_plan_milestones` (1, 2, 3 partes…).
- **Eventos de comisión**: viven en `commission_events` y congelan la regla aplicada a cada cliente.
- **Pagos del cliente**: viven en `referral_payments` y determinan cuándo un evento pasa de `pendiente` → `ganado` → `pagado`.

---

## 🗂️ Convenciones y reglas
- `UUID` = identificador técnico (relaciones entre tablas).
- `user_code` (ej: `CON-XXXX`) = identificador humano del conector (para links y auditoría).
- **Un DNI = un cliente** (anti-duplicados).
- El **primer conector** que registra el DNI conserva la comisión (en UPSERT no se cambia `referrer_id`).
- Las reglas de comisión **no se recalculan retroactivamente**: los `commission_events` congelan lo aplicado.

---

## 🔗 Relaciones entre tablas (ER simplificado)

### Relaciones principales
- `referrals.referrer_id` → `users.id`  (**un referral pertenece a un conector**)
- `commission_plans.perfil` → `users.perfil` (**un plan aplica a un perfil**)
- `commission_plan_milestones.plan_id` → `commission_plans.id` (**milestones de un plan**)
- `commission_events.referral_id` → `referrals.id` (**eventos por referral**)
- `referral_payments.referral_id` → `referrals.id` (**pagos por referral**)

### Cardinalidades (en simple)
- Un `user` puede tener muchos `referrals`.
- Un `referral` puede tener muchos `referral_payments`.
- Un `referral` puede tener muchos `commission_events` (según milestones).
- Un `perfil` tiene **1 plan activo** en `commission_plans`.
- Un `plan` tiene **N milestones** en `commission_plan_milestones`.

---

## 📋 Tablas y campos clave

### 1) `users` — Conectores / Usuarios
**Propósito:** almacenar conectores/comerciales y su `perfil`.

Campos clave:
- `id` (uuid, PK)
- `user_code` (text, UNIQUE) — ej: `CON-Z55X6H1165`
- `referral_code` (text, UNIQUE) — para compartir enlaces (si aplica)
- `nombre`, `email`, `telefono`
- `perfil` (`perfil_usuario`) — `Conector | Conector Pro | Comercial`
- `referred_by` (uuid) — si un usuario fue referido por otro
- `status`, `status_notes`, `status_updated_at`
- `created_at`, `updated_at`

---

### 2) `referrals` — Clientes referidos (leads)
**Propósito:** almacenar el cliente y el conector dueño del referral.

Campos clave:
- `id` (uuid, PK)
- `referrer_id` (uuid, NOT NULL) — **UUID del conector** (`users.id`)
- `referrer_code` (text) — **código humano** del conector (`CON-XXXX`)
- Identidad cliente:
  - `cliente_dni` (text)  ✅ **clave única del cliente**
  - `cliente_nombre`, `cliente_email`, `cliente_telefono`
  - `cliente_direccion`, `cliente_provincia`, `cliente_estado_civil`
- Financieros captura inicial:
  - `deuda_total`, `presupuesto_inicial`, `cuota_mensual`
- Operación:
  - `asesor_juridico` (text)
  - `status` (text) — recomendado: `pendiente | contactado | evaluacion | aprobado | rechazado | completado | pagado`
  - `notes` (text)
- Trazabilidad:
  - `source`, `page_url`, `page_title`, `external_uuid`
- `created_at`, `updated_at`

Regla anti-duplicados:
- Índice único recomendado: `UNIQUE (LOWER(TRIM(cliente_dni)))`

---

### 3) `commission_plans` — Plan de comisión por perfil
**Propósito:** configuración editable desde dashboard.

Campos clave:
- `id` (uuid, PK)
- `perfil` (`perfil_usuario`)
- `currency` (text, default `EUR`)
- `min_client_paid` (numeric) — acumulado mínimo del cliente para completar la comisión (ej: 1000)
- `total_commission` (numeric) — total comisión del perfil (ej: 300)
- `is_active` (bool) — **solo 1 activo por perfil**
- `name`, `notes`
- `created_at`, `updated_at`

---

### 4) `commission_plan_milestones` — Divisiones/hitos del plan
**Propósito:** definir pagos parciales (1/2/3… partes).

Campos clave:
- `id` (uuid, PK)
- `plan_id` (uuid, FK a `commission_plans.id`)
- `milestone_amount` (numeric) — acumulado requerido (ej: 500, 1000)
- `commission_amount` (numeric) — comisión liberada en ese hito (ej: 150)
- `sort_order` (int)
- `created_at`, `updated_at`

Regla:
- `UNIQUE(plan_id, milestone_amount)`

---

### 5) `commission_events` — Eventos reales de comisión por referral
**Propósito:** congelar la regla aplicada y trackear estado de comisión.

Campos recomendados:
- `id` (uuid, PK)
- `referral_id` (uuid, FK a `referrals.id`)
- `milestone_amount` (numeric)
- `commission_amount` (numeric)
- `status` (text) — `pendiente | ganado | pagado`
- `earned_at` (timestamptz, opcional)
- `paid_at` (timestamptz, opcional)
- `payout_id` (text/uuid, opcional)
- `created_at`, `updated_at`

Regla anti-duplicados:
- `UNIQUE(referral_id, milestone_amount)`

---

### 6) `referral_payments` — Pagos del cliente
**Propósito:** registrar pagos reales del cliente y habilitar cálculo por acumulado.

Campos recomendados:
- `id` (uuid, PK)
- `referral_id` (uuid, FK a `referrals.id`)
- `amount` (numeric)
- `paid_at` (timestamptz)
- `method` (text, opcional)
- `external_payment_id` (text, opcional)
- `notes` (text, opcional)
- `created_at`

---

## 🔄 Flujo operativo paso a paso (con datos requeridos)

### Flujo A — Alta de referral (cliente)
**Entrada mínima (desde formulario/webhook):**
- Conector: `user_code` (ej: `CON-XXXX`)
- Cliente: `cliente_dni`, `cliente_nombre`, `cliente_telefono` (ideal), `cliente_email` (opcional pero útil)
- Opcional: `asesor_juridico`, `deuda_total`, `presupuesto_inicial`, `cuota_mensual`, `page_url`

**Pasos:**
1) **Buscar conector**
   - Query: `users` por `user_code`
   - Resultado: `users.id` (esto será `referrer_id`) y `users.perfil`

2) **Crear/Actualizar cliente (UPSERT por DNI)**
   - Tabla: `referrals`
   - Clave: `LOWER(TRIM(cliente_dni))`
   - Insert si no existe, update si existe
   - Regla: en el update **NO cambiar** `referrer_id` (protege la comisión)

3) **Generar eventos de comisión (solo cuando se crea el referral)**
   - Determinar plan activo: `commission_plans` donde `perfil = users.perfil` AND `is_active=true`
   - Copiar milestones del plan: `commission_plan_milestones`
   - Insertar en `commission_events` con status `pendiente`
   - Evitar duplicados: `UNIQUE(referral_id, milestone_amount)`

**Salida esperada:**
- Un registro en `referrals`
- N registros en `commission_events` (según milestones del plan)

---

### Flujo B — Registrar pago del cliente
**Entrada mínima:**
- `referral_id` (UUID del cliente en `referrals`)
- `amount`
- `paid_at`
- Opcional: `external_payment_id`

**Pasos:**
1) Insertar pago en `referral_payments`
2) Calcular acumulado: `SUM(amount)` por `referral_id`
3) Marcar eventos como `ganado` cuando el acumulado alcance `milestone_amount`
   - Recom: guardar `earned_at` cuando cambia a `ganado`

**Salida esperada:**
- Registro en `referral_payments`
- Actualización en `commission_events` (`pendiente` → `ganado`)

---

### Flujo C — Pagar comisión al conector (payout)
**Entrada mínima:**
- Selección de eventos `commission_events` con `status='ganado'`
- Identificación del pago (opcional): `payout_id`

**Pasos:**
1) Pagar al conector (fuera de BD: transferencia, Stripe, etc.)
2) Marcar eventos como `pagado` + `paid_at=NOW()` + `payout_id`

**Salida esperada:**
- `commission_events.status='pagado'`

---

## ✅ Checklist de integridad recomendada
- `referrals.referrer_id` NOT NULL
- `referrals` con índice único por DNI: `LOWER(TRIM(cliente_dni))`
- `commission_plans`: 1 plan activo por perfil
- `commission_events`: `UNIQUE(referral_id, milestone_amount)`

---

## 🧪 Queries útiles (rápidos)

### Ver plan activo por perfil
```sql
SELECT *
FROM commission_plans
WHERE perfil = 'Conector' AND is_active = true;
```

### Ver milestones de un plan
```sql
SELECT *
FROM commission_plan_milestones
WHERE plan_id = '<PLAN_UUID>'
ORDER BY sort_order;
```

### Ver pagos acumulados de un referral
```sql
SELECT referral_id, SUM(amount) AS total_paid
FROM referral_payments
WHERE referral_id = '<REFERRAL_UUID>'
GROUP BY referral_id;
```

### Ver eventos ganados por conector
```sql
SELECT ce.*
FROM commission_events ce
JOIN referrals r ON r.id = ce.referral_id
WHERE r.referrer_id = '<USER_UUID>'
  AND ce.status = 'ganado'
ORDER BY ce.milestone_amount;
```

---

## 🔐 Nota de seguridad (RLS)
- Si el formulario inserta datos: idealmente hacerlo vía **Service Role** en un endpoint controlado (n8n) y no con inserciones públicas.
- No exponer tablas de comisiones públicamente.

---

## 📌 Estado actual
- Perfiles cargados en `commission_plans` (Conector, Conector Pro, Comercial).
- El dashboard podrá administrar:
  - planes por perfil
  - milestones por plan
  - eventos y pagos por cliente
