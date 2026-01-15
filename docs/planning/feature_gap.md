# Feature Gap Analysis: Teman Batin

Berdasarkan struktur kode saat ini, website **Teman Batin** sudah kuat sebagai *utility tool* (Calculator & Report Generator), tetapi masih kurang fitur untuk menjaga user tetap kembali (**Retention**) dan menyebarkan konten (**Virality**).

Berikut adalah fitur yang belum ada tapi sangat umum/dibutuhkan di niche Human Design:

## 1. 💑 Relationship / Compatibility Charts (Composite)
**Status: Belum Ada**
*   **Fungsi**: User memasukkan data diri dan pasangan, lalu melihat kecocokan channel energi mereka (Kompromi, Dominasi, Elektromagnetik).
*   **Kenapa Penting?**: Ini adalah *use case* paling populer kedua setelah chart pribadi. Orang sangat ingin tahu kecocokan dengan pasangan/keluarga.
*   **Potensi Revenue**: Bisa dijual sebagai "Love & Relationship Report".

## 2. 📅 Daily Transits (Horoskop Harian ala HD)
**Status: Belum Ada**
*   **Fungsi**: Menampilkan posisi planet *hari ini* dan bagaimana pengaruhnya terhadap chart user.
*   **Kenapa Penting?**: Ini fitur **Retention #1**. User hanya cek chart lahir sekali seumur hidup, tapi mereka akan kembali **setiap hari** untuk cek energi hari ini (Transit).

## 3. ⚙️ Admin Dashboard
**Status: Belum Ada**
*   **Fungsi**: Halaman khusus owner untuk:
    *   Melihat grafik penjualan harian.
    *   Mengatur/Membuat kode kupon baru.
    *   Melihat list affiliate dan komisi.
    *   Mengakses list user yang register.
*   **Kenapa Penting?**: Saat ini sepertinya manajemen data harus bongkar database Supabase langsung, yang berisiko dan tidak praktis.

## 4. 📚 Interactive "Learn" Library
**Status: Statis / Terbatas**
*   **Saat ini**: Penjelasan hanya muncul di Tooltip chart result.
*   **Saran**: Buat halaman "Kamus HD". Jika user klik "Gate 30" di chart mereka, arahkan ke halaman detail Gate 30 dengan konten yang lebih deep (dan SEO friendly).
*   **Benefit**: SEO traffic organik yang besar.

## 5. 📸 Social Share Cards (Viral Loops)
**Status: Basic (hanya copy link)**
*   **Fungsi**: Tombol "Share to Instagram Story" yang men-generate gambar estetik (berisi Type, Profile, & Incarnation Cross user) siap posting.
*   **Kenapa Penting?**: Human Design sangat visual dan *shareable*. Biarkan user jadi marketing gratisan Anda di sosmed.

## Rekomendasi Prioritas

Jika ingin mengejar **Growth/Sales**, prioritaskan:
1.  **Affiliate System** (sedang direncanakan).
2.  **Social Share Cards** (agar viral).

Jika ingin mengejar **Retention/Daily Users**, prioritaskan:
1.  **Daily Transits**.
2.  **Compatibility Charts**.
