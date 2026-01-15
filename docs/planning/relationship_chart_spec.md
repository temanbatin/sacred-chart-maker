# Technical Deep Dive: Relationship (Connection) Charts (UPDATED)

## Overview
Fitur "Connection Chart" (Composite) adalah fitur premium yang memungkinkan user melihat dinamika energi antara dua orang (Pasangan, Orang Tua-Anak, Rekan Bisnis).

Fitur ini akan memanfaatkan **API Human Design VPS** yang sudah tersedia: `POST /analyze/composite`.

## Technical Architecture

Kita akan menggunakan **Opsi B (VPS API Integration)** yang jauh lebih efisien karena logic perhitungan sudah ada.

### 1. Backend Integration

Kita perlu membuat Edge Function baru (atau flow n8n baru) yang meneruskan data ke endpoint API VPS.

**Endpoint Target:** `POST http://localhost:9021/analyze/composite` (atau URL publik VPS)

**Payload Request:**
```json
{
  "person1": { "place": "...", "year": 1990, "month": 1, "day": 1, "hour": 12, "minute": 0 },
  "person2": { "place": "...", "year": 1992, "month": 2, "day": 2, "hour": 14, "minute": 30 }
}
```

**Response API:**
*   `participants`: Array nama/id.
*   `new_channels`: Channel yang terbentuk dari gabungan (Electromagnetic).
*   `composite_chakras`: Center yang terdefinisi dalam chart gabungan.

### 2. Frontend Implementation (`ConnectionChart.tsx`)

#### Input Form
*   Tab 1: "My Data" (bisa ambil dari akun login).
*   Tab 2: "Partner Data".

#### Visualization
*   **Composite Matrix**: Menampilkan Tabel Koneksi (9-0, 8-1, dll).
*   **Channel List**:
    *   **Electromagnetic**: Channel yang baru terbentuk (Hot/Attraction).
    *   **Companionship**: Channel yang sama-sama dimiliki (Friendship).
    *   **Dominance**: Satu orang punya, satu tidak.
*   **Bodygraph**:
    *   Gunakan library bodygraph yang sama.
    *   Warnai `Composite Channel` dengan warna khusus (misal: Ungu) untuk Electromagnetic.

### 3. Monetization
*   User Gratis: Hanya lihat "Connection Theme".
*   User Premium (Bayar/Unlock): Lihat detail channel dan analisis lengkap.

## Roadmap & Effort (Accelerated)

Dengan adanya API ini, estimasi waktu terpangkas signifikan:

*   **Backend Integration**: 0.5 Hari (Cuma proxy request ke VPS/n8n).
*   **Frontend UI**: 2 Hari (Input Form & Result Display).
*   **Total Estimasi**: ~3 Hari (vs 1 Minggu sebelumnya).
