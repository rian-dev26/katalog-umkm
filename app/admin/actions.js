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

/**
 * Server Action untuk ganti password admin yang sedang login.
 * Validasi: admin sudah login, password minimal 8 karakter dan sama dengan konfirmasi.
 */
export async function gantiPassword(prevStateOrFormData, maybeFormData) {
  const isActionState = maybeFormData instanceof FormData;
  const formData = isActionState ? maybeFormData : prevStateOrFormData;

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent("Sesi telah berakhir, silakan login kembali.")
    );
  }

  const passwordBaru = formData?.get?.("password_baru")?.toString() || "";
  const konfirmasiPassword =
    formData?.get?.("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) {
    const pesan = "Password baru dan konfirmasi password wajib diisi.";
    if (isActionState) return { error: pesan };
    redirect(`/admin/password?error=${encodeURIComponent(pesan)}`);
  }

  if (passwordBaru.length < 8) {
    const pesan = "Password baru minimal 8 karakter.";
    if (isActionState) return { error: pesan };
    redirect(`/admin/password?error=${encodeURIComponent(pesan)}`);
  }

  if (passwordBaru !== konfirmasiPassword) {
    const pesan = "Password baru dan konfirmasi password tidak sama.";
    if (isActionState) return { error: pesan };
    redirect(`/admin/password?error=${encodeURIComponent(pesan)}`);
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    const pesan = error.message || "Gagal mengganti password.";
    if (isActionState) return { error: pesan };
    redirect(`/admin/password?error=${encodeURIComponent(pesan)}`);
  }

  const pesanSukses = "Password berhasil diperbarui.";
  if (isActionState) return { success: pesanSukses };
  redirect(`/admin/password?sukses=${encodeURIComponent(pesanSukses)}`);
}

export const updatePassword = gantiPassword;


/**
 * Server Action untuk menambah produk baru (US-08).
 * Wajib memeriksa sesi login admin di server.
 */
export async function tambahProduk(formData) {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent("Sesi telah berakhir, silakan login kembali.")
    );
  }

  const nama = formData.get("nama")?.toString().trim();
  const harga = parseInt(formData.get("harga")?.toString() || "0", 10);
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!nama || isNaN(harga) || harga < 0) {
    redirect(
      "/admin/produk/baru?error=" +
        encodeURIComponent("Nama dan harga produk wajib diisi dengan benar.")
    );
  }

  const { error } = await supabase.from("produk").insert([
    {
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    },
  ]);

  if (error) {
    redirect(
      "/admin/produk/baru?error=" + encodeURIComponent(error.message)
    );
  }

  redirect("/admin");
}


/**
 * Server Action untuk mengubah produk (US-09).
 * Wajib memeriksa sesi login admin di server.
 */
export async function ubahProduk(formData) {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent("Sesi telah berakhir, silakan login kembali.")
    );
  }

  const id = formData.get("id");
  const nama = formData.get("nama")?.toString().trim();
  const harga = parseInt(formData.get("harga")?.toString() || "0", 10);
  const kategori = formData.get("kategori")?.toString().trim() || null;
  const foto_url = formData.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData.get("deskripsi")?.toString().trim() || null;

  if (!id || !nama || isNaN(harga) || harga < 0) {
    redirect(
      `/admin/produk/${id}/ubah?error=` +
        encodeURIComponent("Nama dan harga produk wajib diisi dengan benar.")
    );
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    redirect(
      `/admin/produk/${id}/ubah?error=` + encodeURIComponent(error.message)
    );
  }

  redirect("/admin");
}

/**
 * Server Action untuk menghapus produk (US-10).
 * Wajib memeriksa sesi login admin di server.
 */
export async function hapusProduk(formData) {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent("Sesi telah berakhir, silakan login kembali.")
    );
  }

  const id = formData.get("id");
  if (!id) {
    redirect("/admin?error=" + encodeURIComponent("ID produk tidak valid."));
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    redirect("/admin?error=" + encodeURIComponent(error.message));
  }

  redirect("/admin");
}
