-- ================================================
-- Migration: Adiciona stripe_customer_id
-- Executado em: 2026-04-23
-- ================================================

-- Adiciona coluna stripe_customer_id na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Cria índice para busca rápida por stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
