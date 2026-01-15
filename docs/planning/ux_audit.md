# UX Audit: Sacred Chart Maker

Analisis ini berfokus pada efisiensi user journey, khususnya di mobile, karena traffic terbesar biasanya dari sana.

## 1. 🚨 Critical Issues (Conversion Blockers)

Faktor yang membuat user "malas" atau bingung dan berpotensi keluar (bounce).

### a. City Search Friction (`MultiStepForm.tsx`)
*   **Masalah**: User harus mengetik minimal 3 huruf sebelum search jalan. Tidak ada feedback visual "sedang mencari" yang jelas sampai user selesai mengetik. Jika koneksi lambat, user mungkin mengira error.
*   **Dampak**: User merasa form "rusak" atau "ribet", lalu keluar.
*   **Solusi**:
    *   Tampilkan state "Ketik 3 huruf..." saat kosong.
    *   Gunakan *skeleton loader* pada dropdown saat searching.
    *   Berikan opsi "Masuk manual" jika API tidak menemukan kota.

### b. Keyboard Pop-up di Mobile (`MultiStepForm.tsx`)
*   **Masalah**: Penggunaan `autoFocus` pada input Step 2 & 3.
*   **Dampak**: Di HP, keyboard langsung muncul dan menutupi tombol navigasi "Lanjut" / "Kembali". User harus manual *dismiss* keyboard untuk klik tombol. Sangat mengganggu flow.
*   **Solusi**: Matikan `autoFocus` di mobile (cek `window.innerWidth`).

## 2. ⚠️ Usability Issues (User Experience)

Hal yang membuat pengalaman terasa "berat" tapi tidak memblokir fungsi.

### a. Information Overload di Chart Result (`ChartResult.tsx`)
*   **Masalah**: Teks penjelasan (Strategy, Authority, dll) sangat panjang dan ditampilkan penuh.
*   **Dampak**: Di mobile, user harus scroll sangat jauh untuk melihat informasi lain. User malas membaca tembok teks.
*   **Solusi**: Gunakan **Accordion/Collapsible**. Tampilkan 2 baris pertama, lalu tombol "Baca selengkapnya".

### b. Posisi Data Planet (`ChartResult.tsx`)
*   **Masalah**: Di mobile, kolom Planet (Design/Personality) digeser ke bawah chart.
*   **Dampak**: User harus scroll bolak-balik antara gambar Bodygraph dan tabel Planet untuk mencocokkan Angka Gate.
*   **Solusi**: Pertimbangkan tabulasi di mobile: [Tab Gambar] | [Tab Data Planet].

### c. Hierarchy Visual Halaman Result
*   **Masalah**: Bagian "Key Info" (Type, Strategy) visualnya kurang menonjol dibanding teks deskripsi.
*   **Solusi**: Buat "Kartu Stats" di paling atas (seperti kartu RPG game) yang merangkum Type, Strategy, Authority dalam satu baris visual icon sebelum masuk ke teks panjang.

## 3. 💡 Quick Wins (Mudah Dikerjakan, Impact Tinggi)

1.  **Sticky CTA**: Di halaman Result (jika belum beli), buat tombol "Unlock Full Report" melayang (sticky) di bawah layar mobile. Ingatkan user terus.
2.  **Celebratory Animation**: Tambahkan animasi confetti saat `PaymentResult` sukses (user suka validasi visual).
3.  **Guest Save Reminder**: Warning *unsaved chart* saat ini hanya teks standar. Ganti dengan *Fixed Banner* di bawah layar yang lebih mencolok tapi bisa di-close.

## Kesimpulan

Website sudah fungsional. Fokus perbaikan ada di **Mobile Responsiveness** (keyboard & layouting teks) untuk meningkatkan retensi user dari "Coba Gratis" ke "Beli Report".
