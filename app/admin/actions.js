"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";

/**
 * Server Action untuk login admin menggunakan Supabase Auth.
 * Mendukung pemanggilan langsung via form action maupun useActionState.
 */
export async function login(prevStateOrFormData, maybeFormData) {
  const isActionState = maybeFormData instanceof FormData;
  const formData = isActionState ? maybeFormData : prevStateOrFormData;

  const email = formData?.get?.("email")?.toString().trim();
  const password = formData?.get?.("password")?.toString();

  if (!email || !password) {
    const pesan = "Email dan password wajib diisi.";
    if (isActionState) return { error: pesan };
    redirect(`/admin/login?error=${encodeURIComponent(pesan)}`);
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let pesan = error.message;
    if (
      error.message.includes("Invalid login credentials") ||
      error.status === 400
    ) {
      pesan = "Email atau password salah. Silakan coba lagi.";
    }
    if (isActionState) return { error: pesan };
    redirect(`/admin/login?error=${encodeURIComponent(pesan)}`);
  }

  redirect("/admin");
}

export const masuk = login;

/**
 * Server Action untuk logout / mengakhiri sesi admin.
 */
export async function keluar() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export const logout = keluar;

