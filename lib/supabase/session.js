import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat client Supabase dengan sesi admin menggunakan @supabase/ssr dan cookie.
 * Menggunakan SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.
 * Dipakai untuk: login, keluar, ganti password, dan aksi CRUD produk admin.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();

  let supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_PUBLISHABLE_KEY belum disetel di environment variable"
    );
  }

  supabaseUrl = supabaseUrl
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/, "")
    .replace(/\/+$/, "");

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Method setAll dipanggil dari Server Component (bisa diabaikan jika middleware/proxy memperbarui sesi).
        }
      },
    },
  });
}

export const createAdminSessionClient = createSessionClient;
export default createSessionClient;

