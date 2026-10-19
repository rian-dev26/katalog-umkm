"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function TombolInstalPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [tampilkan, setTampilkan] = useState(false);
  const [sudahInstal, setSudahInstal] = useState(false);
  const [ditutup, setDitutup] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [bukaPanduan, setBukaPanduan] = useState(false);

  useEffect(() => {
    // Daftarkan service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW terdaftar:", reg.scope))
        .catch((err) => console.error("SW gagal:", err));
    }

    // Cek apakah sudah diinstal (standalone mode)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      setSudahInstal(true);
      return;
    }

    // Cek apakah pernah ditutup di sesi ini
    const statusTutup = sessionStorage.getItem("pwa_prompt_dismissed");
    if (statusTutup === "true") {
      setDitutup(true);
    }

    // Deteksi iOS (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (iosDevice) {
      setIsIOS(true);
      setTampilkan(true);
      return;
    }

    // Tangkap event beforeinstallprompt (Android & Chrome Desktop)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTampilkan(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Deteksi jika sudah diinstal
    const instalHandler = () => {
      setSudahInstal(true);
      setTampilkan(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", instalHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", instalHandler);
    };
  }, []);

  const handleInstal = async () => {
    // iOS: tampilkan panduan manual
    if (isIOS) {
      setBukaPanduan(true);
      return;
    }

    // Android / Desktop
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setSudahInstal(true);
      setTampilkan(false);
    }
    setDeferredPrompt(null);
  };

  const handleTutup = () => {
    setDitutup(true);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  // Jangan tampilkan jika sudah diinstal, ditutup pengguna, atau belum siap
  if (sudahInstal || ditutup || !tampilkan) return null;

  return (
    <>
      {/* Banner Floating di Bagian Bawah Layar */}
      <aside
        aria-label="Pemasangan Aplikasi"
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-garis bg-latar/95 p-3.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-garis bg-permukaan">
              <Image
                src="/icons/icon-192.png"
                alt="Ikon Aplikasi"
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-teks sm:text-sm">
                Pasang Aplikasi
              </p>
              <p className="truncate text-[11px] text-teks-lembut">
                Akses cepat langsung dari layar HP
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              id="tombol-instal-bawah"
              onClick={handleInstal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-utama px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-utama-gelap active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Pasang
            </button>

            <button
              onClick={handleTutup}
              className="rounded-lg p-2 text-teks-lembut transition-colors hover:bg-permukaan hover:text-teks"
              title="Tutup pemberitahuan"
              aria-label="Tutup pemberitahuan"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Modal Panduan Khusus iOS (Safari) */}
      {bukaPanduan && isIOS && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div
            className="fixed inset-0"
            onClick={() => setBukaPanduan(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-garis bg-latar p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-teks">
                Cara pasang di iPhone / iPad
              </h3>
              <button
                onClick={() => setBukaPanduan(false)}
                className="text-teks-lembut hover:text-teks"
                aria-label="Tutup panduan"
              >
                ✕
              </button>
            </div>

            <ol className="space-y-3 text-xs text-teks-lembut">
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-utama text-[11px] font-bold text-white">
                  1
                </span>
                <span>
                  Ketuk tombol{" "}
                  <strong className="text-teks">
                    Bagikan (Share)
                  </strong>{" "}
                  di bar navigasi Safari (ikon panah ke atas).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-utama text-[11px] font-bold text-white">
                  2
                </span>
                <span>
                  Gulir ke bawah pada menu, lalu pilih{" "}
                  <strong className="text-teks">
                    Tambahkan ke Layar Utama
                  </strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-utama text-[11px] font-bold text-white">
                  3
                </span>
                <span>
                  Ketuk <strong className="text-teks">Tambah</strong> di pojok kanan atas layar.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setBukaPanduan(false)}
              className="mt-4 w-full rounded-lg bg-permukaan py-2 text-xs font-semibold text-teks transition-colors hover:bg-garis"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
