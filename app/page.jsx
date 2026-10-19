import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const q = params?.q?.trim() || "";
  const kategoriAktif = params?.kategori || "";

  let daftarProduk = [];
  let semuaKategori = [];
  let pesanError = null;

  try {
    const supabase = createClient();

    // Ambil daftar kategori unik untuk tombol filter
    const { data: katData } = await supabase.from("produk").select("kategori");

    if (katData) {
      semuaKategori = [
        ...new Set(katData.map((item) => item.kategori).filter(Boolean)),
      ];
    }

    let query = supabase
      .from("produk")
      .select("id, nama, harga, deskripsi, foto_url, kategori, created_at")
      .order("created_at", { ascending: false });

    if (kategoriAktif) {
      query = query.eq("kategori", kategoriAktif);
    }
    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Gagal memuat daftar produk dari database.";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5 pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          {/* Form Pencarian (US-11) */}
          <form method="GET" action="/" className="relative w-full max-w-xs">
            <input
              name="q"
              type="search"
              placeholder="Cari produk..."
              defaultValue={q}
              className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
          </form>
        </div>

        {/* Filter Kategori (US-11) */}
        {semuaKategori.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={q ? `/?q=${encodeURIComponent(q)}` : "/"}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                !kategoriAktif
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks hover:border-utama"
              }`}
            >
              Semua
            </Link>
            {semuaKategori.map((kat) => (
              <Link
                key={kat}
                href={`/?kategori=${encodeURIComponent(kat)}${
                  q ? `&q=${encodeURIComponent(q)}` : ""
                }`}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  kategoriAktif === kat
                    ? "bg-utama text-white"
                    : "border border-garis bg-latar text-teks hover:border-utama"
                }`}
              >
                {kat}
              </Link>
            ))}
          </div>
        )}

        {pesanError ? (
          <div
            role="alert"
            className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya"
          >
            <p className="font-semibold">Gagal memuat produk dari database</p>
            <p className="mt-1 text-teks-lembut">{pesanError}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-12 text-center text-teks-lembut">
            {q || kategoriAktif
              ? "Tidak ada produk yang cocok dengan pencarian atau filter."
              : "Belum ada produk"}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
