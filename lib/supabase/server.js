import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi client Supabase di sisi server menggunakan service role key (SUPABASE_SECRET_KEY).
 * Digunakan untuk membaca data publik (seperti katalog dan detail produk) yang terlindungi RLS.
 */
export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum disetel di environment variable"
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = createClient;
export default createClient;

