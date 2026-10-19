import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi client Supabase di sisi server menggunakan service role key (SUPABASE_SECRET_KEY).
 * Digunakan untuk membaca data publik (seperti katalog dan detail produk) yang terlindungi RLS.
 */
export function createClient() {
  let supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum disetel di environment variable"
    );
  }

  // Normalisasi URL jika tidak sengaja mencantumkan path /rest/v1 atau garis miring di akhir
  supabaseUrl = supabaseUrl.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "").replace(/\/+$/, "");

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = createClient;
export default createClient;

