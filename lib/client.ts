import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // for server-side

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase URL and API key are required. Check your .env.local"
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
};