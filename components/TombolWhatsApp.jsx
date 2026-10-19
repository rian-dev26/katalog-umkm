"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

// US-03 & US-12 (bonus): tombol WhatsApp dengan pemilihan jumlah produk
export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  const nomor = toko.nomorWhatsApp?.replace(/[^0-9]/g, "") || "";
  const totalHarga = produk.harga * jumlah;
  const pesan = `Halo, saya ingin memesan ${produk.nama} sebanyak ${jumlah} buah (total ${formatRupiah(
    totalHarga
  )}).`;
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Pemilih Jumlah (US-12) */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-teks">Jumlah:</span>
        <div className="flex items-center rounded-lg border border-garis bg-latar">
          <button
            type="button"
            onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 text-base font-bold text-teks-lembut hover:text-utama"
            aria-label="Kurangi jumlah"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-semibold">{jumlah}</span>
          <button
            type="button"
            onClick={() => setJumlah((prev) => prev + 1)}
            className="px-3 py-1 text-base font-bold text-teks-lembut hover:text-utama"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
        <span className="text-sm text-teks-lembut">
          Total: <strong className="text-harga">{formatRupiah(totalHarga)}</strong>
        </span>
      </div>

      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
