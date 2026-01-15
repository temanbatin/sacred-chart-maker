# Product Roadmap: Teman Batin (Omniverse Strategy)

Roadmap ini menggabungkan ekspansi produk (Horizontal) dan kedalaman fitur (Vertical), serta inisiatif baru (WhatsApp AI).

## 1. Product Lineup (Daftar Produk)

### A. Core Report (B2C) - *Automated*
1.  **Personal Advance Analysis (Existing)**
    *   *Status*: Live & Stable.
    *   *Focus*: Maintain & UX Polish.
2.  **Parenting Report (New)**
    *   *Concept*: Analisis HD anak, fokus pada gaya belajar, bakat komunikasi, dan "cara mengasuh sesuai desain".
    *   *Tech*: Re-use engine `calculate-chart`, beda Prompt LLM.
    *   *Timeline*: **Phase 2**.
3.  **BaZi Report (New)**
    *   *Concept*: Analisis Metafisika Cina (4 Pilar Nasib) untuk melengkapi HD.
    *   *Tech*: Integrasi Python API di VPS.
    *   *Timeline*: **Phase 2**.
4.  **Relationships / Composite (New)**
    *   *Concept*: Panduan dinamika hubungan 2 orang.
    *   *Tech*: Integrasi VPS API `/analyze/composite`.
    *   *Timeline*: **Phase 2**.

### B. Enterprise / High-Ticket (B2B) - *Manual/Consultation*
5.  **Penta Analysis (Corporate)**
    *   *Concept*: Analisis dinamika tim kecil (3-5 orang) untuk bisnis.
    *   *Implementation*: Halaman Landing Page khusus dengan tombol "Hubungi Kami" / "Book Consultation". Tidak auto-generate.
    *   *Timeline*: **Phase 3**.

### C. Retention & Innovation
6.  **Daily Transits**
    *   *Concept*: "Weather Report" energi harian.
    *   *Tech*: Integrasi VPS API `/transits/daily`.
    *   *Goal*: Daily Active Users (DAU).
7.  **WhatsApp "Pocket Coach" AI**
    *   *Concept*: Chatbot personal yang "hafal" chart user.
    *   *Goal*: Engagement & Lead Magnet.

### D. Global Expansion
8.  **White Label & English Version**
    *   *Concept*: Menyewakan engine kita ke Coach/Astrologer luar negeri. Mereka pakai branding sendiri.
    *   *Tech*: Implementasi i18n (Multi-language) pada Frontend & Report Template.
    *   *Timeline*: **Phase 4**.

---

## 2. Revised Execution Timeline

### **Phase 1: Foundation (Minggu 1-2)**
*   **Fokus**: UX Fixes & Affiliate System.
*   **Goal**: Siap untuk traffic besar tanpa boncos di user confusion.
*   *Task*: Affiliate Dashboard, Mobile UX, Payment Gateway Stability.

### **Phase 2: Product Expansion (Minggu 3-5)**
*   **Fokus**: Menambah SKU Produk (Parenting, BaZi, Composite).
*   **Goal**: Meningkatkan Customer Lifetime Value (CLV). User beli Personal -> beli Parenting -> beli BaZi.
*   *Task*:
    *   Integrasi endpoint BaZi & Composite VPS.
    *   Prompt Engineering untuk Parenting Report.

### **Phase 3: Retention & AI (Bulan 2)**
*   **Fokus**: Daily Engagement.
*   **Goal**: User tidak uninstall/lupa website.
*   *Task*:
    *   Daily Transit Dashboard.
    *   Development WhatsApp Chatbot MVP.

### **Phase 4: Global Scale (Bulan 3+)**
*   **Fokus**: B2B & International Market.
*   **Goal**: Revenue Stream baru dari lisensi/white label.
*   *Task*: translate seluruh UI & Report ke Bahasa Inggris.
