-- =============================================================================
-- BARBERCYBER PRO — Schema SQL para Supabase
-- Execute este script no "SQL Editor" do Supabase (painel lateral esquerdo).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE plan_type AS ENUM ('ESSENTIAL', 'ENTERPRISE');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELED', 'NO_SHOW');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- TABELA: profiles
-- Conectada ao auth.users do Supabase. Criada automaticamente via trigger
-- quando um novo usuário se registra via Supabase Auth.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT '',
  plan_type     plan_type NOT NULL DEFAULT 'ESSENTIAL',
  has_plus5_addon BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: cria um perfil automaticamente ao registrar usuário no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- TABELA: staff
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  specialty       TEXT NOT NULL,
  commission_rate FLOAT NOT NULL DEFAULT 0.40,
  is_available    BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS staff_user_id_idx ON public.staff(user_id);

-- -----------------------------------------------------------------------------
-- TABELA: appointments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  staff_id      UUID NOT NULL REFERENCES public.staff(id) ON DELETE RESTRICT,
  client_name   TEXT NOT NULL,
  client_phone  TEXT NOT NULL,
  service_name  TEXT NOT NULL,
  price         FLOAT NOT NULL,
  scheduled_at  TIMESTAMPTZ NOT NULL,
  status        appointment_status NOT NULL DEFAULT 'PENDING',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS appointments_user_id_idx     ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS appointments_staff_id_idx    ON public.appointments(staff_id);
CREATE INDEX IF NOT EXISTS appointments_scheduled_at_idx ON public.appointments(scheduled_at);

-- -----------------------------------------------------------------------------
-- TABELA: transactions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_id   UUID UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  gross_value      FLOAT NOT NULL,
  commission_value FLOAT NOT NULL,
  net_profit       FLOAT NOT NULL,
  date             TIMESTAMPTZ NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx    ON public.transactions(date);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário só enxerga e modifica seus próprios dados.
-- -----------------------------------------------------------------------------

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: leitura própria"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: atualização própria"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- staff
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff: leitura própria"
  ON public.staff FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "staff: inserção autenticada"
  ON public.staff FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "staff: atualização própria"
  ON public.staff FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "staff: exclusão própria"
  ON public.staff FOR DELETE
  USING (auth.uid() = user_id);

-- appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments: leitura própria"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "appointments: inserção autenticada"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "appointments: atualização própria"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "appointments: exclusão própria"
  ON public.appointments FOR DELETE
  USING (auth.uid() = user_id);

-- transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions: leitura própria"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "transactions: inserção autenticada"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "transactions: atualização própria"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================================================
-- FIM DO SCRIPT
-- =============================================================================
