import { createClient } from '@supabase/supabase-js';

/**
 * Onde encontrar os valores abaixo:
 *   Supabase Dashboard → Settings (engrenagem) → API
 *   → "Project URL"  → VITE_SUPABASE_URL
 *   → "anon public"  → VITE_SUPABASE_ANON_KEY
 */
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    'Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnon);
