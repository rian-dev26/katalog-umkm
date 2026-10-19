import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";
import { createSessionClient } from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params, searchParams }) {
  const { id } = await params;
  const p = await searchParams;
  const error = p?.error;

  const supabase = await createSessionClient();
  const { data: produk, error: fetchError } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori, created_at")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>

      {error && (
        <div
          role="alert"
          className="max-w-xl rounded-xl border border-garis bg-permukaan p-3 text-sm text-bahaya"
        >
          {error}
        </div>
      )}

      <FormProduk produk={produk} action={ubahProduk} labelTombol="Simpan perubahan" />
    </div>
  );
}
