# Katalog UMKM + Order WhatsApp: Sirait Coffee

Aplikasi katalog produk online untuk **Sirait Coffee**, sebuah usaha kopi lokal. Pengunjung dapat melihat katalog kopi dan camilan, mencari produk, memilih kategori, menentukan jumlah pesanan, dan langsung memesan lewat WhatsApp. Pemilik toko (admin) dapat masuk ke dashboard untuk mengelola produk dan mengganti password.

Template workshop vibe coding Creative Hub App Talent (CHAT) 2026. Dibangun menggunakan **Next.js 16 (App Router)**, **Tailwind CSS 4**, dan **Supabase**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fandixurniawan%2Fkatalog-umkm&project-name=katalog-umkm&repository-name=katalog-umkm)

---

## Fitur yang Diterapkan

### 1. Fitur Utama (Wajib — US-01 s/d US-06)

- **US-01 (Katalog dari Database):** Halaman utama menampilkan daftar produk dari tabel `produk` di Supabase secara server-side.
- **US-02 (Detail Produk):** Halaman `/produk/[id]` menampilkan detail foto, nama, kategori, harga, dan deskripsi produk dari database. Jika produk tidak ditemukan, menampilkan halaman `notFound`.
- **US-03 (Pesan via WhatsApp):** Tombol pesan otomatis membuka tautan WhatsApp ke nomor toko dengan format pesan nama dan harga produk ter-encode (`encodeURIComponent`).
- **US-04 (Login Admin & Sesi):** Login admin menggunakan Supabase Auth (email dan password) dengan `@supabase/ssr` dan cookie. Serta tombol "Keluar" di navigasi untuk mengakhiri sesi.
- **US-05 (Ganti Password):** Form ganti password di `/admin/password` dengan validasi server-side minimal 8 karakter dan konfirmasi kecocokan.
- **US-06 (Proteksi Halaman Admin):** File `proxy.js` di root proyek (fitur middleware Next.js 16) yang menjaga seluruh rute `/admin` kecuali `/admin/login`. Jika belum login, pengunjung otomatis dialihkan ke halaman login.

### 2. Fitur Tambahan (Bonus — US-07 s/d US-13)

- **US-07 (List Produk Admin):** Halaman `/admin` menampilkan daftar produk langsung dari database Supabase secara realtime.
- **US-08 (Tambah Produk):** Form di `/admin/produk/baru` untuk menambah produk baru ke database Supabase (terkunci sesi login admin).
- **US-09 (Ubah Produk):** Form di `/admin/produk/[id]/ubah` terisi otomatis dengan data lama dan menyimpan pembaruan ke database (terkunci sesi login admin).
- **US-10 (Hapus Produk):** Tombol hapus pada tabel admin meminta konfirmasi dialog browser sebelum menghapus produk dari database (terkunci sesi login admin).
- **US-11 (Filter Kategori & Pencarian):** Pengunjung dapat mencari produk berdasarkan nama dan menyaring produk berdasarkan kategori di halaman katalog.
- **US-12 (Pilih Jumlah Pesanan):** Pengunjung dapat memilih jumlah produk (+/−) sebelum memesan; total harga otomatis dihitung dan tercantum di pesan WhatsApp.
- **US-13 (Progressive Web App - PWA):** Aplikasi dapat di-install langsung di layar HP pengunjung seperti aplikasi native dengan file `app/manifest.js` dan ikon standar.

---

## Keamanan

- **Server-Side Only:** Seluruh komunikasi ke Supabase dijalankan di sisi server (Server Component, Server Action, dan `proxy.js`). Browser pengunjung tidak pernah memanggil API Supabase secara langsung.
- **Tanpa Prefiks Publik:** Environment variable tidak menggunakan awalan `NEXT_PUBLIC_` sehingga kredensial aman dari browser client.
- **Proteksi Mutasi Data:** Setiap Server Action yang mengubah data (`tambahProduk`, `ubahProduk`, `hapusProduk`, `gantiPassword`) wajib memvalidasi sesi admin aktif di server sebelum mengeksekusi query.
- **Git Ignore:** File `.env.local` terdaftar di `.gitignore` dan tidak pernah di-commit ke repositori Git.

---

## Teknologi

- **Framework:** Next.js 16.3.8 (App Router, Server Actions, Turbopack)
- **Styling:** Tailwind CSS 4.3.3
- **Database & Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Hosting:** Vercel

---

## Cara Menjalankan

1. Clone repositori ke komputer lokal:
   ```bash
   git clone https://github.com/<akunmu>/<nama-repo>.git
   cd <nama-repo>
   npm install
   ```

2. Buat file `.env.local` dari `.env.example`:
   ```bash
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...
   ```

3. Jalankan server lokal:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser.

---

## Sebelum Mengumpulkan

1. Jalankan semua poin di `docs/checklist-keamanan.md` dan `docs/checklist-pengujian.md` pada link Vercel.
2. Lengkapi bagian di bawah ini.
3. Push perubahan terakhir sebelum batas waktu.

---

## Tentang aplikasi ini

- **Nama usaha:** Sirait Coffee
- **Pembuat:** Rian Andika Sirait 
- **Link aplikasi:** https://katalog-umkm-beta.vercel.app
- **Fitur bonus yang dikerjakan:** US-07 (List produk admin dari database), US-08 (Tambah produk), US-09 (Ubah produk), US-10 (Hapus produk), US-11 (Filter kategori atau pencarian), US-12 (Pilih jumlah atau varian), US-13 (PWA)
