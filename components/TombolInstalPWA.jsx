"use client";

import { useState, useEffect } from "react";

export default function TombolInstalPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [tampilkan, setTampilkan] = useState(false);
  const [sudahInstal, setSudahInstal] = useState(false);
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

    // Deteksi iOS (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (iosDevice) {
      setIsIOS(true);
      setTampilkan(true);
      return;
    }

    // Tangkap event beforeinstallprompt (Android / Desktop Chrome)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTampilkan(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Deteksi jika diinstal setelah prompt
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
      setBukaPanduan((prev) => !prev);
      return;
    }

    // Android/Desktop: pakai prompt bawaan browser
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setSudahInstal(true);
      setTampilkan(false);
    }
    setDeferredPrompt(null);
  };

  // Jangan tampilkan apa pun jika sudah instal atau belum ada prompt
  if (sudahInstal || !tampilkan) return null;

  return (
    <div className="relative">
      <button
        id="tombol-instal-pwa"
        onClick={handleInstal}
        className="inline-flex items-center gap-1.5 rounded-lg bg-utama px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-utama-gelap hover:shadow-md active:scale-95"
        title="Pasang aplikasi"
      >
        {/* Ikon download */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
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
        <span className="hidden sm:inline">Pasang aplikasi</span>
        <span className="sm:hidden">Pasang</span>
      </button>

      {/* Panduan iOS */}
      {bukaPanduan && isIOS && (
        <>
          {/* Overlay transparan untuk menutup */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setBukaPanduan(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-garis bg-latar p-4 shadow-xl">
            <p className="mb-3 text-sm font-bold text-teks">
              Cara pasang di iPhone:
            </p>
            <ol className="space-y-2.5 text-xs text-teks-lembut">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-utama text-[10px] font-bold text-white">
                  1
                </span>
                <span>
                  Ketuk ikon{" "}
                  <strong className="text-teks">
                    Bagikan{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="inline-block align-text-bottom"
                      aria-hidden="true"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </strong>{" "}
                  di bawah layar Safari
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-utama text-[10px] font-bold text-white">
                  2
                </span>
                <span>
                  Gulir ke bawah, ketuk{" "}
                  <strong className="text-teks">
                    Tambahkan ke Layar Utama
                  </strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-utama text-[10px] font-bold text-white">
                  3
                </span>
                <span>
                  Ketuk <strong className="text-teks">Tambah</strong>
                </span>
              </li>
            </ol>
            <button
              onClick={() => setBukaPanduan(false)}
              className="mt-3 w-full rounded-lg border border-garis py-1.5 text-xs font-semibold text-teks-lembut transition-colors hover:border-utama hover:text-utama"
            >
              Tutup
            </button>
          </div>
        </>
      )}
    </div>
  );
}
