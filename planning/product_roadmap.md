# Product Roadmap

## Future Features

### Personalized Audio
- **Description:** Audio konten yang dipersonalisasi berdasarkan Human Design chart pengguna.
- **Types:**
  - Meditasi (Meditation)
  - Brainwave entrainment
  - Afirmasi positif (Affirmations)
- **Goal:** Membantu pengguna melakukan deconditioning dan penyelarasan energi melalui media audio.

### Teman AI - WhatsApp Bot Assistant
- **Description:** AI-powered WhatsApp chatbot yang dapat memberikan konseling dan panduan personal berdasarkan Human Design chart pengguna.
- **Features:**
  - Chat 24/7 dengan AI assistant yang memahami unique design pengguna
  - Personalized advice untuk keputusan sehari-hari
  - Reminders dan affirmations berbasis HD chart
  - Progress tracking dan journaling guidance
- **Purchase Eligibility Logic:**
  - **Requirement:** User harus sudah pernah membeli minimal 1 Human Design Report (Essential atau Full)
  - **Implementation:** Check `orders` table untuk `status = 'PAID'` dan product mengandung "Human Design Report"
  - **UI/UX:** 
    - Jika belum eligible: Tampilkan locked state dengan message "Unlock Teman AI dengan membeli Human Design Report terlebih dahulu"
    - Jika sudah eligible: Tampilkan CTA normal untuk pembelian/subscribe
- **Goal:** Memberikan value berkelanjutan kepada existing customers dan meningkatkan customer lifetime value.
