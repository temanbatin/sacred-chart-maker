# WhatsApp AI Chatbot Concept: "Teman Batin Pocket Coach"

Mengubah Human Design dari "Laporan Statis" menjadi "Teman Curhat 24/7" yang mengerti desain unik user.

## 1. Ide & Use Cases

### A. "Chat with your Chart" (Personal Assistant)
User bisa bertanya masalah sehari-hari, dan AI menjawab konteks chart mereka.
*   **User**: *"Aku lagi stuck banget kerjaan rasanya berat, kenapa ya?"*
*   **Bot (Projector)**: *"Ingat profil kamu adalah Projector. Apakah kamu sudah menunggu undangan sebelum bekerja keras? Rasa 'berat' (Bitterness) adalah sinyal bahwa kamu memaksakan diri tanpa pengakuan. Coba istirahat dulu..."*

### B. Daily Energy Notification (Retention)
Setiap pagi jam 7, Bot mengirim pesan pendek:
*   *"Selamat pagi Budi (Generator)! Hari ini transit membawa energi Gate 34 (Power). Kamu akan merasa sangat bertenaga, tapi hati-hati jangan 'buang energi' untuk hal yang tidak kamu respon ya. Have a sacral day!"*

### C. Leard Magnet (Funnel)
Akses gratis terbatas untuk menarik user baru.
*   User kirim Tanggal Lahir -> Bot kasih Ringkasan Chart Pendek + Link "Beli Full Report".

---

## 2. Technical Architecture

Untuk menghemat biaya dan skalabilitas, kita gunakan arsitektur Serverless:

### **Stack**
1.  **WhatsApp Provider**:
    *   *Option A (Official)*: **Meta Cloud API** (Gratis 1000 percakapan pertama/bulan). Paling stabil & aman.
    *   *Option B (Unofficial)*: **Baileys/Wppconnect** (Pakai nomor HP sendiri, 0 biaya per pesan). Kurang stabil untuk scale.
    *   *Recommendation*: **Meta Official API** (karena kita bisnis serius + butuh fitur tombol/list).
2.  **Brain (Logic)**: **Supabase Edge Functions**.
3.  **Knowledge Base**: **Supabase pgvector** (Menyimpan chart user dalam bentuk teks/embedding agar AI bisa membacanya).
4.  **AI Model**: **Gemini Flash / GPT-4o-mini** (Cepat & Murah).

### **Data Flow**
1.  User kirim chat WA -> Webhook ke Supabase Function.
2.  Supabase cek No. HP User di database.
    *   *JIKA ADA*: Ambil data Chart User (Type, Profile, Incarnation Cross).
    *   *JIKA TIDAK*: Minta user input tanggal lahir (Onboarding).
3.  Kirim Prompt ke LLM:
    *   *System Prompt*: "Kamu adalah Coach Human Design yang empatik. Ini data chart user: [Data Chart]. Jawab pertanyaan user berdasarkan strategi & otoritas mereka."
4.  Reply ke User via WA API.

---

## 3. Monetization Strategy

1.  **Freemium Model**:
    *   **Free**: Generate Chart Pendek, 3x chat tanya jawab chart.
    *   **Upsell**: "Kuota habis! Mau chat sepuasnya & dapat Daily Transit? Langganan **Teman Batin Club** 49rb/bulan."
    
2.  **Add-on Report**:
    *   User yang beli Full Report otomatis dapat akses "Bulan Pertama Gratis" chat bot ini.

---

## 4. Next Steps (Actionable)

1.  **Validasi**: Buat tombol "Join Waitlist WhatsApp Bot" di website untuk cek minat.
2.  **Prototype**: Setup Meta Developer Account & Supabase Edge Function sederhana untuk tes "Echo Bot" dulu.
