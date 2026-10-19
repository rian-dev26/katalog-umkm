# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat file `lib/supabase/server.js` untuk inisialisasi client Supabase server dengan `SUPABASE_SECRET_KEY`.
- Halaman `app/page.jsx` berhasil mengambil daftar produk dari tabel `produk` di Supabase secara server-side.
- Kartu produk ditampilkan dengan `KartuProduk`.
- Penanganan error dan tampilan "Belum ada produk" sudah berfungsi.
- `CatatanBelumAktif` dihapus dari halaman beranda.

**Perbaikan:**
- Menambahkan sanitasi URL otomatis di `lib/supabase/server.js` untuk membersihkan akhiran `/rest/v1` atau trailing slash berlebih.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- File `app/produk/[id]/page.jsx` berhasil mengambil satu data produk dari tabel `produk` berdasarkan parameter dynamic `id`.
- Jika data tidak ditemukan, otomatis memanggil fungsi `notFound()`.
- Tampilan detail produk dan tombol WhatsApp dipertahankan.
- `CatatanBelumAktif` dihapus dari halaman detail produk.

**Perbaikan:**
- Memakai `.maybeSingle()` agar jika id tidak ditemukan tidak menghasilkan exception yang merusak halaman, melainkan diteruskan ke `notFound()`.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- `components/TombolWhatsApp.jsx` diubah menjadi tautan `<a>` ke `https://wa.me/<nomor>?text=<pesan>`.
- Nomor diambil dari `lib/toko.js`.
- Pesan otomatis memuat nama produk dan harga rupiah ter-encode menggunakan `encodeURIComponent`.
- Tautan membuka di tab baru (`target="_blank"` dan `rel="noopener noreferrer"`).
- Styling tombol tetap dipertahankan.

**Perbaikan:**
- Memastikan pembersihan karakter non-angka pada nomor WhatsApp jika terdapat spasi atau tanda hubung.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Dibuat `lib/supabase/session.js` menggunakan `@supabase/ssr` dan cookie store (`next/headers`).
- Dibuat `app/admin/actions.js` yang menyediakan Server Action `login` dan `keluar`.
- Form di `app/admin/login/page.jsx` disambungkan ke `login`, menampilkan error jika gagal, dan `CatatanBelumAktif` dihapus.
- Tombol "Keluar" di `components/NavAdmin.jsx` disambungkan ke `keluar` via form submit.

**Perbaikan:**
- Menangani pesan error kredensial tidak valid ke bahasa Indonesia yang ramah pengguna.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Menambahkan Server Action `gantiPassword` di `app/admin/actions.js` dengan validasi sesi login (`supabase.auth.getUser()`).
- Validasi password baru minimal 8 karakter dan kecocokan konfirmasi di sisi server.
- Mengubah password pengguna via `supabase.auth.updateUser()`.
- Form di `app/admin/password/page.jsx` menampilkan notifikasi berhasil atau pesan error.
- `CatatanBelumAktif` dihapus.

**Perbaikan:**
- Memastikan `gantiPassword` memvalidasi keberadaan sesi aktif sebelum memproses pembaruan password.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Dibuat file `proxy.js` di root proyek sebagai middleware Next.js 16.
- Menjaga seluruh rute `/admin/:path*` (kecuali `/admin/login`) agar dialihkan ke `/admin/login` jika belum login.
- Mengalihkan admin yang sudah login dari `/admin/login` langsung ke `/admin`.
- Memastikan Server Action yang memodifikasi data memverifikasi sesi login.
- Menghapus `CatatanBelumAktif` dari `app/admin/page.jsx`.

**Perbaikan:**
- Menambahkan penanganan matcher rute yang presisi untuk Next.js 16.

## Debugging dan fitur bonus

### [SENDIRI] Memperbaiki Error Invalid path specified in request URL
- **Masalah:** Pada saat awal koneksi Supabase, muncul error `Invalid path specified in request URL`.
- **Penyebab:** Nilai `SUPABASE_URL` di `.env.local` memiliki akhiran `/rest/v1/`, sedangkan library `@supabase/supabase-js` otomatis menambahkan `/rest/v1/` ke endpoint.
- **Solusi:** Nilai `SUPABASE_URL` diubah menjadi `https://zqrmvjwlssbszzhntbjg.supabase.co` dan ditambahkan fungsi normalisasi URL otomatis di `lib/supabase/server.js` dan `lib/supabase/session.js`.
