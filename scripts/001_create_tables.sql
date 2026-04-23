-- ================================================
-- Script de criação das tabelas - BARBERCYBER
-- ================================================

-- Criar tipos ENUM
CREATE TYPE plan_type AS ENUM ('ESSENTIAL', 'ENTERPRISE');
CREATE TYPE appointment_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELED', 'NO_SHOW');

-- ================================================
-- Tabela: users
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  plan_type plan_type DEFAULT 'ESSENTIAL',
  has_plus5_addon BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- Tabela: report_logs
-- ================================================
CREATE TABLE IF NOT EXISTS report_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_logs_user_id ON report_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_report_logs_created_at ON report_logs(created_at);

-- ================================================
-- Tabela: staff
-- ================================================
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  commission_rate FLOAT DEFAULT 0.40,
  is_available BOOLEAN NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);

-- ================================================
-- Tabela: appointments
-- ================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  service_name TEXT NOT NULL,
  price FLOAT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status appointment_status DEFAULT 'PENDING',
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_appointments_staff_id ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);

-- ================================================
-- Tabela: transactions
-- ================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gross_value FLOAT NOT NULL,
  commission_value FLOAT NOT NULL,
  net_profit FLOAT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  appointment_id UUID UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

-- ================================================
-- Row Level Security (RLS)
-- ================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para users (usuário só pode ver/editar próprio registro)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para report_logs
CREATE POLICY "Users can view own report_logs" ON report_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own report_logs" ON report_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para staff
CREATE POLICY "Users can view own staff" ON staff
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own staff" ON staff
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own staff" ON staff
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own staff" ON staff
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para appointments
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments" ON appointments
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
