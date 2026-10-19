# Sirait Coffee — Katalog Online + Order WhatsApp

Aplikasi katalog produk online untuk **Sirait Coffee**, sebuah usaha kopi lokal. Pengunjung dapat melihat menu, memilih jumlah pesanan, dan langsung memesan lewat WhatsApp. Admin mengelola produk melalui dashboard yang dilindungi autentikasi.

Dibangun dengan **Next.js 16**, **Tailwind CSS 4**, dan **Supabase** — di-deploy di **Vercel**.

## Fitur

### Fitur Utama (US-01 s/d US-06)

| Fitur | Keterangan |
| --- | --- |
| **Katalog produk** | Menampilkan semua produk dari database Supabase secara server-side |
| **Detail produk** | Halaman `/produk/[id]` menampilkan foto, nama, harga, deskripsi, dan kategori |
| **Pesan via WhatsApp** | Tombol pesan membuka WhatsApp dengan teks otomatis berisi nama produk dan harga |
| **Login admin** | Login email dan password menggunakan Supabase Auth + cookie (`@supabase/ssr`) |
| **Ganti password** | Admin dapat mengganti password dengan validasi minimal 8 karakter di server |
| **Proteksi halaman admin** | `proxy.js` (middleware Next.js 16) memblokir akses `/admin` tanpa login |

### Fitur Bonus (US-07 s/d US-13)

| Fitur | Keterangan |
| --- | --- |
| **US-07** List produk admin | Halaman `/admin` menampilkan produk dari database, bukan data contoh |
| **US-08** Tambah produk | Form di `/admin/produk/baru` menyimpan produk ke database |
| **US-09** Ubah produk | Form di `/admin/produk/[id]/ubah` terisi data lama dan menyimpan perubahan |
| **US-10** Hapus produk | Tombol hapus dengan konfirmasi browser, lalu menghapus dari database |
| **US-11** Filter & pencarian | Pengunjung bisa menyaring produk berdasarkan kategori atau mencari nama produk |
| **US-12** Pilih jumlah pesanan | Pengunjung memilih jumlah barang (+/−) sebelum pesan; total harga otomatis dihitung |
| **US-13** PWA | Aplikasi bisa di-install di layar HP dengan ikon dan manifest |

## Keamanan

- Semua akses Supabase dilakukan di **sisi server** (Server Component, Server Action, proxy.js).
- Environment variable **tidak** memakai awalan `NEXT_PUBLIC_`.
- Browser **tidak pernah** menghubungi Supabase secara langsung.
- Setiap Server Action yang mengubah data **wajib** memeriksa sesi login admin di server.
- File `.env.local` tercantum di `.gitignore` dan tidak pernah di-commit.

## Teknologi

| Teknologi | Versi | Fungsi |
| --- | --- | --- |
| Next.js | 16.3.8 | Framework React dengan App Router dan Server Actions |
| Tailwind CSS | 4.3.3 | Utility-first CSS framework |
| Supabase | — | Database PostgreSQL, Auth, dan Row Level Security |
| @supabase/ssr | 0.12.7 | Koneksi sesi admin dengan cookie |
| Vercel | — | Hosting dan deployment otomatis |

## Struktur Folder

```
app/
  page.jsx                  Katalog produk (US-01, US-11)
  manifest.js               Web App Manifest (US-13)
  produk/[id]/page.jsx      Detail produk (US-02, US-03)
  admin/
    actions.js              Server Action: login, keluar, ganti password, CRUD produk
    login/page.jsx          Halaman login (US-04)
    page.jsx                Daftar produk admin (US-07)
    password/page.jsx       Ganti password (US-05)
    produk/baru/page.jsx    Tambah produk (US-08)
    produk/[id]/ubah/...    Ubah produk (US-09)
components/
  Header.jsx                Navbar dengan nama toko
  Footer.jsx                Footer dengan alamat dan jam buka
  KartuProduk.jsx           Kartu produk di katalog
  TabelProduk.jsx           Tabel produk di halaman admin (US-10)
  TombolWhatsApp.jsx        Tombol pesan WhatsApp + pemilih jumlah (US-03, US-12)
  FormProduk.jsx            Form tambah/ubah produk (US-08, US-09)
  NavAdmin.jsx              Navigasi admin + tombol keluar (US-04)
  Tombol.jsx                Komponen tombol (utama, garis, bahaya)
  Input.jsx                 Komponen input dan textarea
lib/
  toko.js                   Identitas toko dan nomor WhatsApp
  format.js                 Format rupiah
  supabase/server.js        Koneksi Supabase server (SUPABASE_SECRET_KEY)
  supabase/session.js       Koneksi sesi admin (@supabase/ssr + cookie)
proxy.js                    Proteksi rute /admin (US-06)
```

## Cara Menjalankan

1. Clone repo dan install dependensi:
   ```bash
   git clone https://github.com/<akunmu>/<nama-repo>.git
   cd <nama-repo>
   npm install
   ```

2. Salin `.env.example` menjadi `.env.local` dan isi nilai dari dashboard Supabase:
   ```bash
   cp .env.example .env.local
   ```

3. Jalankan server lokal:
   ```bash
   npm run dev
   ```

4. Buka `http://localhost:3000`.

## Environment Variable

| Variabel | Sumber |
| --- | --- |
| `SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase > Project Settings > API > anon / publishable key |
| `SUPABASE_SECRET_KEY` | Supabase > Project Settings > API > service_role / secret key |

> **Penting:** Jangan beri awalan `NEXT_PUBLIC_`. Jangan commit file `.env.local`.

## Kustomisasi

- **Identitas toko:** ubah `lib/toko.js` (nama, tagline, nomor WhatsApp, alamat, jam buka).
- **Warna:** ubah token di `app/globals.css` bagian `@theme` (lihat `DESIGN.md`).
- **Produk:** kelola langsung di halaman admin atau di Supabase > Table Editor > produk.

## Tentang aplikasi ini

- **Nama usaha:** Sirait Coffee
- **Pembuat:** *(isi nama kamu)*
- **Link aplikasi:** *(isi link Vercel kamu)*
- **Fitur yang dikerjakan:**
  - ✅ US-01 Katalog dari database
  - ✅ US-02 Detail produk
  - ✅ US-03 Pesan via WhatsApp
  - ✅ US-04 Login admin
  - ✅ US-05 Ganti password
  - ✅ US-06 Proteksi halaman admin
  - ✅ US-07 List produk admin dari database *(bonus)*
  - ✅ US-08 Tambah produk *(bonus)*
  - ✅ US-09 Ubah produk *(bonus)*
  - ✅ US-10 Hapus produk *(bonus)*
  - ✅ US-11 Filter kategori & pencarian *(bonus)*
  - ✅ US-12 Pilih jumlah pesanan *(bonus)*
  - ✅ US-13 PWA installable *(bonus)*
