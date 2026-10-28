import { createClient } from "@/utils/supabase/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

/**
 * Indica se as variáveis de ambiente do Supabase foram configuradas.
 * Utiliza @supabase/ssr com NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabasePublishableKey &&
    !supabaseUrl.includes("seu-projeto") &&
    supabaseUrl.startsWith("http")
);

export const supabase = isSupabaseConfigured ? createClient() : null;
