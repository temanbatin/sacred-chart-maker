# Design Plan: Simplifikasi Layout Chart Result

Tujuan: Mengurangi "Information Overload" dan scrolling berlebihan pada halaman hasil chart, terutama di Mobile.

## 1. Masalah Utama (Current State)
1.  **Scroll Death**: User harus scroll sangat jauh ke bawah untuk melihat data planet karena layoutnya bertumpuk (Stacked) di mobile.
2.  **Wall of Text**: Penjelasan Tipe, Strategi, dll muncul penuh (full text) sehingga mendominasi layar.
3.  **Disconnected Visuals**: Saat melihat data planet di bawah, user sudah kehilangan konteks gambar Bodygraph di atas.

## 2. Solusi Desain (Proposed Changes)

### A. Mobile Tabbed Interface (Bodygraph vs Data)
Alih-alih menumpuk semuanya, kita gunakan **Tabs** untuk bagian visual utama di Mobile.

**Layout Mobile:**
```
[ Header: Nama & Info Lahir ]

-- TABS MENU --
[ 📊 Chart Image ]  [ 🪐 Planet Data ]

-- TAB CONTENT: Chart Image --
[ Gambar Bodygraph Besar ]
[ 4 Arrows Variable (Bawah) ]

-- TAB CONTENT: Planet Data --
[ Design Column (Merah) ] | [ Personality Column (Hitam) ]
(Side-by-side agar lebih hemat tempat)
```

**Benefit**: User fokus ke satu hal dalam satu waktu. Jika ingin lihat detail planet, tinggal pindah tab tanpa scroll jauh.

### B. Accordion untuk Penjelasan
Gunakan komponen **Collapsible** atau **Accordion** untuk deskripsi panjang.

**Layout:**
```
[ ICON ] Generator
"Kamu adalah sumber energi..." (2 baris pertama)
[ v Baca Selengkapnya ] (Expandable)
```

**Benefit**: Layout terlihat bersih ("Clean"), user tidak merasa terintimidasi oleh banyaknya teks.

### C. "Compact Stats Card" (Header)
Saat ini informasi Type, Strategy, Authority tersebar dalam kartu-kartu besar. Kita akan buat ringkasan di atas (Sticky atau Top Section).

**Layout Grid Kecil:**
*   **Type**: Generator
*   **Profile**: 1/3
*   **Authority**: Sacral
*   **Strategy**: To Respond

### D. Upsell Section Refinement
Pindahkan bagian Upsell ("Unlock Full Report") agar tidak terlalu agresif, tapi tetap terlihat (menggunakan Sticky CTA yang sudah dibuat). Bagian Upsell di body page bisa dibuat lebih visual (Carousel) dan tidak memakan terlalu banyak vertical space.

## 3. Technical Implementation Steps

1.  **Import Components**: Gunakan `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` dari `@/components/ui/tabs`. Gunakan `Accordion` jika perlu, atau state simple `isExpanded`.
2.  **Refactor `ChartResult.tsx`**:
    *   Bungkus area Bodygraph & Planet dalam `Tabs` (Mobile only).
    *   Buat component kecil `ExpandableText` untuk deskripsi.
    *   Redesign `Stats Grid` agar lebih compact.

## 4. Preview Mockup Logic

*   **Before**: Image -> Planets (Long) -> Type Card (Huge) -> Stats Grid -> Footer.
*   **After**: Stats Grid (Compact) -> Tabs [Image | Planets] -> Type Card (Expandable) -> Footer.
