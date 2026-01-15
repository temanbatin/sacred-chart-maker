# Analisis Fitur Affiliate & Dashboard

Berdasarkan pengecekan codebase yang ada, berikut adalah analisis kelayakan untuk fitur Affiliate.

## Kesimpulan: Cukup Mudah (Medium Effort)

Sistem yang ada sekarang sudah memiliki fondasi yang kuat, yaitu:
1.  **Sistem Kupon (`coupons` table)**: Sudah ada. Kita bisa menghubungkan kode kupon dengan affiliator.
2.  **Tracking Order (`orders` table)**: Sudah lengkap dengan status pembayaran.
3.  **Payment Gateway (Midtrans)**: Webhook sudah jalan (`midtrans-webhook`), jadi kita bisa otomatis catat komisi saat pembayaran sukses.
4.  **Dashboard User (`Account.tsx`)**: Sudah ada tempat untuk user login, tinggal tambah menu "Affiliate".

Tidak perlu membangun sistem dari nol, kita hanya perlu "menumpang" flow yang sudah ada.

---

## Apa yang Perlu Dibuat?

Berikut adalah komponen yang perlu ditambahkan:

### 1. Database (Schema)
Kita perlu menambahkan 2 tabel baru (atau modifikasi yang ada):
-   **`affiliates` table** (atau kolom tambahan di `profiles`): Untuk simpan data affiliator (kode referral unik, info rekening, saldo).
-   **`commissions` table**: Untuk mencatat riwayat komisi per transaksi (Order ID -> Affiliate ID -> Jumlah Komisi).

### 2. Backend (Supabase Functions)
-   **Modifikasi `midtrans-checkout`**: Saat user pakai kupon, sistem harus cek apakah kupon itu milik affiliator. Jika ya, simpan ID affiliator di data order (`metadata`).
-   **Modifikasi `midtrans-webhook`**: Saat pembayaran **SUKSES** (Capture/Settlement), sistem harus otomatis:
    1.  Cek apakah order punya ID affiliator.
    2.  Hitung komisi (misal 10% atau fixed amount).
    3.  Catat ke tabel `commissions`.

### 3. Frontend (Dashboard)
Di halaman `Account.tsx`, kita akan tambah tab/halaman baru **"Area Affiliate"** yang berisi:
-   **Statistik**: Total klik (opsional), Total Penjualan, Total Komisi.
-   **Kode Kupon Saya**: Affiliator bisa lihat/generate kode unik mereka.
-   **Riwayat Komisi**: List siapa saja yang beli pakai kode mereka dan berapa komisinya.

---

## Estimasi Pengerjaan

Fitur ini bisa dikerjakan dalam **3 Tahap**:

1.  **Tahap 1 (Database & Register)**: Setup tabel dan fitur user daftar jadi affiliate.
2.  **Tahap 2 (Tracking & Logic)**: Update fungsi checkout dan webhook untuk catat komisi.
3.  **Tahap 3 (Dashboard UI)**: Tampilan grafik dan angka untuk affiliator.

**Estimasi Waktu:** Kurang lebih **1-2 hari kerja** untuk versi MVP (Minimum Viable Product).

## Rekomendasi
Saya sarankan menggunakan sistem **Berbasis Kupon** (Coupon Based Attribution).
-   User Affiliate dapat Kode Unik (misal: `BUDI20`).
-   Pembeli pakai kode `BUDI20` dapat diskon (misal 10%).
-   Affiliator (Budi) dapat komisi (misal 20%).
-   **Kelebihan**: Lebih akurat daripada link tracking (cookie) dan insentif jelas bagi pembeli untuk memakai kode tersebut.
