-- ============================================
-- SISTEMA DE REFERIDOS - SCHEMA SUPABASE
-- ============================================
-- Este script crea la estructura completa para el sistema de referidos
-- Incluye: usuarios, referidos, funciones, triggers e índices
-- ============================================

-- ============================================
-- 1. EXTENSIONES
-- ============================================
-- Habilitar extensión para generar UUIDs (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. FUNCIONES AUXILIARES
-- ============================================

-- Función para generar código único alfanumérico
CREATE OR REPLACE FUNCTION generate_unique_code(prefix TEXT, length INTEGER DEFAULT 6)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Sin I, O, 0, 1 para evitar confusión
    result TEXT := prefix;
    i INTEGER;
    random_char TEXT;
BEGIN
    FOR i IN 1..length LOOP
        random_char := SUBSTR(chars, FLOOR(RANDOM() * LENGTH(chars) + 1)::INTEGER, 1);
        result := result || random_char;
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Función para generar user_code único (mejorada para evitar colisiones)
CREATE OR REPLACE FUNCTION generate_user_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    exists_check BOOLEAN;
    attempts INTEGER := 0;
    max_attempts INTEGER := 100;
    timestamp_part TEXT;
BEGIN
    LOOP
        attempts := attempts + 1;
        
        -- Si hemos intentado muchas veces, agregar timestamp para garantizar unicidad
        IF attempts > 10 THEN
            -- Usar últimos 4 dígitos del timestamp para mayor unicidad
            timestamp_part := SUBSTR(EXTRACT(EPOCH FROM NOW())::TEXT, -4);
            new_code := generate_unique_code('CON-', 4) || timestamp_part;
        ELSE
            new_code := generate_unique_code('CON-', 6);
        END IF;
        
        -- Verificar si existe
        SELECT EXISTS(SELECT 1 FROM users WHERE user_code = new_code) INTO exists_check;
        
        -- Si no existe, salir del loop
        EXIT WHEN NOT exists_check;
        
        -- Si hemos intentado demasiadas veces, usar hash MD5 como fallback
        IF attempts >= max_attempts THEN
            new_code := 'CON-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT || NOW()::TEXT || RANDOM()::TEXT), 1, 8));
            -- Verificar una vez más
            SELECT EXISTS(SELECT 1 FROM users WHERE user_code = new_code) INTO exists_check;
            IF NOT exists_check THEN
                EXIT;
            END IF;
            -- Si aún existe, generar uno con timestamp
            new_code := 'CON-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT || NOW()::TEXT || EXTRACT(EPOCH FROM NOW())::TEXT), 1, 10));
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Función para generar referral_code único (mejorada para evitar colisiones)
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    exists_check BOOLEAN;
    attempts INTEGER := 0;
    max_attempts INTEGER := 100;
    timestamp_part TEXT;
BEGIN
    LOOP
        attempts := attempts + 1;
        
        -- Si hemos intentado muchas veces, agregar timestamp para garantizar unicidad
        IF attempts > 10 THEN
            -- Usar últimos 4 dígitos del timestamp para mayor unicidad
            timestamp_part := SUBSTR(EXTRACT(EPOCH FROM NOW())::TEXT, -4);
            new_code := generate_unique_code('REF-', 4) || timestamp_part;
        ELSE
            new_code := generate_unique_code('REF-', 6);
        END IF;
        
        -- Verificar si existe
        SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = new_code) INTO exists_check;
        
        -- Si no existe, salir del loop
        EXIT WHEN NOT exists_check;
        
        -- Si hemos intentado demasiadas veces, usar hash MD5 como fallback
        IF attempts >= max_attempts THEN
            new_code := 'REF-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT || NOW()::TEXT || RANDOM()::TEXT), 1, 8));
            -- Verificar una vez más
            SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = new_code) INTO exists_check;
            IF NOT exists_check THEN
                EXIT;
            END IF;
            -- Si aún existe, generar uno con timestamp
            new_code := 'REF-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT || NOW()::TEXT || EXTRACT(EPOCH FROM NOW())::TEXT), 1, 10));
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. TABLA: users (Usuarios/Conectores)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_code TEXT UNIQUE NOT NULL, -- Código único para tracking (ej: "CON-ABC123")
    referral_code TEXT UNIQUE NOT NULL, -- Código para compartir en enlaces (ej: "REF-XYZ789")
    
    -- Datos del formulario de inscripción
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefono TEXT NOT NULL, -- Formato: +34612345678
    provincia TEXT,
    tiene_contacto TEXT,
    autonomo_empresa TEXT,
    privacidad BOOLEAN NOT NULL DEFAULT false,
    newsletter BOOLEAN NOT NULL DEFAULT false,
    
    -- Sistema de referidos
    referred_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Usuario que lo refirió
    referral_tag TEXT, -- Tag de la URL que usó para registrarse
    
    -- Estados del proceso
    status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'evaluacion', 'aprobado', 'rechazado', 'activo', 'inactivo')),
    status_notes TEXT, -- Notas sobre el estado actual
    status_updated_at TIMESTAMPTZ, -- Última actualización de estado
    
    -- Campos técnicos
    form_id UUID UNIQUE NOT NULL, -- ID único del formulario de inscripción
    page_url TEXT, -- URL donde se registró
    page_title TEXT, -- Título de la página
    
    -- Honeypot (anti-spam)
    hp_website TEXT,
    hp_confirm_email TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comentarios en la tabla y columnas
COMMENT ON TABLE users IS 'Tabla principal de usuarios/conectores del sistema de referidos';
COMMENT ON COLUMN users.user_code IS 'Código único del usuario para tracking interno (ej: CON-ABC123)';
COMMENT ON COLUMN users.referral_code IS 'Código único para compartir en enlaces de referidos (ej: REF-XYZ789)';
COMMENT ON COLUMN users.referred_by IS 'ID del usuario que refirió a este usuario';
COMMENT ON COLUMN users.referral_tag IS 'Tag de la URL que usó para registrarse (puede ser el referral_code del referidor)';
COMMENT ON COLUMN users.status IS 'Estado actual: pendiente, evaluacion, aprobado, rechazado, activo, inactivo';
COMMENT ON COLUMN users.form_id IS 'ID único del formulario de inscripción para tracking';

-- ============================================
-- 4. TABLA: referrals (Referidos)
-- ============================================

CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Usuario que hizo el referido
    referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Usuario referido
    status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'contactado', 'evaluacion', 'aprobado', 'rechazado', 'completado', 'pagado')),
    commission_amount NUMERIC(10, 2) NOT NULL DEFAULT 300.00, -- Monto de comisión en euros
    commission_paid BOOLEAN NOT NULL DEFAULT false,
    commission_paid_at TIMESTAMPTZ,
    notes TEXT, -- Notas adicionales sobre el referido
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Evitar duplicados: un usuario solo puede ser referido una vez por el mismo referidor
    UNIQUE(referrer_id, referred_user_id)
);

COMMENT ON TABLE referrals IS 'Tabla para trackear los referidos de cada usuario';
COMMENT ON COLUMN referrals.status IS 'Estado del referido: pendiente, contactado, evaluacion, aprobado, rechazado, completado, pagado';
COMMENT ON COLUMN referrals.commission_amount IS 'Monto de comisión en euros (por defecto 300€)';

-- ============================================
-- 5. TRIGGERS
-- ============================================

-- Trigger para actualizar updated_at en users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en referrals
CREATE TRIGGER update_referrals_updated_at
    BEFORE UPDATE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para generar user_code y referral_code automáticamente al insertar
-- Si los códigos vienen desde el webhook (JavaScript), los usa
-- Si no vienen, los genera automáticamente
CREATE OR REPLACE FUNCTION set_user_codes()
RETURNS TRIGGER AS $$
DECLARE
    max_retries INTEGER := 5;
    retry_count INTEGER := 0;
BEGIN
    -- Solo generar user_code si no se proporcionó desde el webhook
    IF NEW.user_code IS NULL OR NEW.user_code = '' THEN
        -- Intentar generar user_code con reintentos en caso de colisión
        LOOP
            BEGIN
                NEW.user_code := generate_user_code();
                EXIT;
            EXCEPTION WHEN unique_violation THEN
                retry_count := retry_count + 1;
                IF retry_count >= max_retries THEN
                    -- Si falla después de varios intentos, usar hash MD5 como último recurso
                    NEW.user_code := 'CON-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT || NOW()::TEXT || EXTRACT(EPOCH FROM NOW())::TEXT), 1, 12));
                    EXIT;
                END IF;
            END;
        END LOOP;
    END IF;
    -- Si NEW.user_code ya tiene valor (viene del webhook), se usa ese valor
    
    retry_count := 0;
    
    -- Solo generar referral_code si no se proporcionó desde el webhook
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        -- Intentar generar referral_code con reintentos en caso de colisión
        LOOP
            BEGIN
                NEW.referral_code := generate_referral_code();
                EXIT;
            EXCEPTION WHEN unique_violation THEN
                retry_count := retry_count + 1;
                IF retry_count >= max_retries THEN
                    -- Si falla después de varios intentos, usar hash MD5 como último recurso
                    NEW.referral_code := 'REF-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT || NOW()::TEXT || EXTRACT(EPOCH FROM NOW())::TEXT), 1, 12));
                    EXIT;
                END IF;
            END;
        END LOOP;
    END IF;
    -- Si NEW.referral_code ya tiene valor (viene del webhook), se usa ese valor
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_codes_trigger
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_user_codes();

-- Trigger para crear registro en referrals cuando un usuario se registra con referred_by
CREATE OR REPLACE FUNCTION create_referral_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el usuario tiene un referred_by, crear registro en referrals
    IF NEW.referred_by IS NOT NULL THEN
        INSERT INTO referrals (referrer_id, referred_user_id, status)
        VALUES (NEW.referred_by, NEW.id, 'pendiente')
        ON CONFLICT (referrer_id, referred_user_id) DO NOTHING; -- Evitar duplicados
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_referral_on_user_insert
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_referral_record();

-- Trigger para actualizar status_updated_at cuando cambia el status
CREATE OR REPLACE FUNCTION update_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.status_updated_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_status_timestamp_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_status_timestamp();

-- ============================================
-- 6. ÍNDICES
-- ============================================

-- Índices únicos (ya creados con UNIQUE constraints)
-- users.email (único)
-- users.user_code (único)
-- users.referral_code (único)
-- users.form_id (único)

-- Índices para búsquedas y filtros
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email); -- Aunque es único, el índice ayuda en búsquedas
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code); -- Para búsquedas por código de referido
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at); -- Para consultas por fecha

-- Índices para referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id); -- Para listar referidos de un usuario
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id); -- Para búsquedas inversas
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status); -- Para filtros por estado
CREATE INDEX IF NOT EXISTS idx_referrals_commission_paid ON referrals(commission_paid); -- Para consultas de comisiones

-- ============================================
-- 7. POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- FASE ACTUAL: RLS deshabilitado para permitir INSERTs públicos
-- En el futuro, cuando se implementen usuarios autenticados, se habilitará RLS

-- Deshabilitar RLS por ahora (permite acceso público para INSERT)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Política temporal: Permitir INSERT público (para el formulario)
CREATE POLICY "Allow public insert on users" ON users
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow public insert on referrals" ON referrals
    FOR INSERT
    TO public
    WITH CHECK (true);

-- NOTA: En el futuro, cuando se implementen usuarios autenticados, se crearán políticas como:
-- - Usuarios solo pueden ver sus propios datos
-- - Usuarios pueden ver sus referidos
-- - Admins pueden ver todo

-- ============================================
-- 8. VISTAS ÚTILES (OPCIONAL)
-- ============================================

-- Vista para ver estadísticas de referidos por usuario
CREATE OR REPLACE VIEW referral_stats AS
SELECT 
    u.id,
    u.user_code,
    u.nombre,
    u.email,
    u.status as user_status,
    COUNT(r.id) as total_referrals,
    COUNT(r.id) FILTER (WHERE r.status = 'pendiente') as pendientes,
    COUNT(r.id) FILTER (WHERE r.status = 'aprobado') as aprobados,
    COUNT(r.id) FILTER (WHERE r.status = 'completado') as completados,
    COUNT(r.id) FILTER (WHERE r.commission_paid = true) as pagados,
    COALESCE(SUM(r.commission_amount) FILTER (WHERE r.commission_paid = true), 0) as total_ganado
FROM users u
LEFT JOIN referrals r ON u.id = r.referrer_id
GROUP BY u.id, u.user_code, u.nombre, u.email, u.status;

COMMENT ON VIEW referral_stats IS 'Vista con estadísticas de referidos por usuario';

-- ============================================
-- 9. FUNCIONES DE UTILIDAD
-- ============================================

-- Función para buscar usuario por referral_code
CREATE OR REPLACE FUNCTION get_user_by_referral_code(ref_code TEXT)
RETURNS TABLE (
    id UUID,
    user_code TEXT,
    nombre TEXT,
    email TEXT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.user_code, u.nombre, u.email, u.status
    FROM users u
    WHERE u.referral_code = ref_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_by_referral_code IS 'Busca un usuario por su código de referido';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- Para verificar la instalación, ejecuta:
-- SELECT * FROM users LIMIT 1;
-- SELECT * FROM referrals LIMIT 1;
-- SELECT * FROM referral_stats LIMIT 5;

