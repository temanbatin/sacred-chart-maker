export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: "Basics" | "Practical" | "Deep Dive";
  readTime: string;
  imageUrl?: string; // URL for the AI generated illustration
  imagePrompt?: string; // The prompt used to generate the image
  content: string; // Markdown content
}

export const LEARN_ARTICLES: Article[] = [
  {
    slug: "apa-itu-human-design",
    title: "Kenapa Hidup Terasa Berat? Berkenalan dengan Human Design",
    excerpt: "Sering merasa salah jurusan dalam hidup? Atau lelah meski sudah kerja keras? Human Design mungkin punya jawabannya.",
    category: "Basics",
    readTime: "5 menit",
    imageUrl: "https://images.unsplash.com/photo-1506784365371-e633d6b8c37c?q=80&w=2000&auto=format&fit=crop", // Placeholder until AI gen
    imagePrompt: "A surreal minimalist illustration of a person carrying a heavy stone uphill vs flowing with a river stream, soft pastel colors, spiritual style",
    content: `
### Pernahkah Kamu Merasa Begini?

Kamu sudah melakukan semua "rumus sukses" yang dikatakan orang. Bangun pagi, kerja keras, *hustle* tiap hari, tapi hasilnya? Justru *burnout*, lelah mental, dan merasa ada yang kosong di dada.

Atau mungkin, kamu sering dibilang "terlalu sensitif", "terlalu lambat", atau "terlalu ambisius"?

**Berita baiknya:** Tidak ada yang salah dengan dirimu. Yang salah mungkin adalah cara kamu memaksakan diri masuk ke cetakan yang bukan ukuranmu.

### Apa Itu Human Design?

Bayangkan Human Design sebagai **"Manual Book"** atau buku panduan operasional untuk dirimu sendiri. Sama seperti kamu tidak akan mengoperasikan iPhone dengan buku panduan mesin cuci, kamu tidak bisa menjalani hidupmu dengan meniru cara orang lain.

Human Design bukan ramalan nasib. Ini adalah sintesis dari ilmu kuno (Astrologi, I-Ching, Chakra, Kabbalah) dan sains modern (Fisika Kuantum, Genetika).

Tujuannya satu: **Memberitahumu cara termudah untuk membuat keputusan yang tepat dan meminimalkan hambatan (resistensi) dalam hidup.**

### Apa yang Akan Kamu Temukan?

Dalam chart Human Design-mu, kamu akan menemukan:
1.  **Energy Type:** Apakah kamu didesain untuk *hustle* (bekerja) terus-menerus, atau memimpin dan mengarahkan?
2.  **Strategy:** Bagaimana cara terbaikmu berinteraksi dengan dunia agar peluang datang sendiri?
3.  **Authority:** "GPS" internalmu. Apakah kamu harus memutuskan pakai logika, insting, atau menunggu emosi reda?

Saat kamu hidup sesuai desainmu, hidup tidak lagi terasa seperti berenang melawan arus, tapi seperti mengalir mengikuti sungai.
    `
  },
  {
    slug: "mencari-jam-lahir",
    title: "Tidak Tahu Jam Lahir? Jangan Asal Tembak!",
    excerpt: "Akurasi chart Human Design sangat bergantung pada jam lahir. Ini cara menemukannya jika akta kelahiranmu hilang.",
    category: "Practical",
    readTime: "4 menit",
    content: `
### Kenapa Jam Lahir Itu Krusial?

Dalam Human Design, perbedaan waktu lahir 10-15 menit saja bisa mengubah **Profile**, **Moon Gate**, atau bahkan **Type** kamu secara keseluruhan. Chart yang tidak akurat sama dengan peta yang salah—bukannya sampai tujuan, kamu malah makin tersesat.

Jadi, sebelum kamu memesan *Full Report*, pastikan data kelahiranmu seakurat mungkin.

### Langkah Mencari Jam Lahir:

**1. Cek Dokumen Lama**
Bongkar lemari lama orang tuamu. Cari Akta Kelahiran asli, buku catatan medis bayi, gelang rumah sakit, atau buku harian ibu. Seringkali jam lahir terselip di dokumen-dokumen ini.

**2. Wawancara Keluarga (Cross-Check)**
Tanya orang tua atau kerabat yang ada saat kelahiran. 
*   *"Apakah saat itu pagi buta, siang bolong, atau pas azan magrib?"*
*   *"Apakah bertepatan dengan acara TV tertentu?"*
Ingatan tentang momen (siang/malam/subuh) bisa mempersempit rentang waktu.

**3. Minta Salinan Catatan Rumah Sakit**
Jika kamu tahu di RS mana kamu lahir, coba hubungi bagian administrasi medis. Rumah sakit biasanya menyimpan rekam medis kelahiran (medical record) hingga puluhan tahun.

**4. Rectification (Rektifikasi) Chart**
Ini adalah cara terakhir. Kamu bisa berkonsultasi dengan Astrolog profesional yang memiliki keahlian *rectification*. Mereka akan melacak jam lahirmu dengan mencocokkan peristiwa-peristiwa besar dalam hidupmu (seperti tanggal lulus, menikah, kecelakaan, dll) dengan pergerakan planet.

**Tips:** Jika kamu benar-benar tidak bisa menemukannya, cobalah buat beberapa chart dengan rentang waktu berbeda (misal: 06:00, 12:00, 18:00). Lihat elemen mana yang **tidak berubah** (konsisten). Biasanya Type dan Strategy cenderung stabil, tapi Profile dan Variable (panah) lebih sensitif terhadap waktu.
    `
  },
  {
    slug: "type-strategy",
    title: "5 Tipe Energi: Kamu yang Mana?",
    excerpt: "Generator, Projector, Manifestor, Reflector. Kenali peran utamamu dalam orkestra kehidupan ini.",
    category: "Basics",
    readTime: "6 menit",
    content: `
Dalam Human Design, manusia dibagi menjadi 5 Tipe Energi. Ini bukan soal kepribadian, tapi soal bagaimana **auramu** bekerja dan berinteraksi dengan orang lain.

### 1. The Generator (Sang Pembangun)
*   **Populasi:** ±37%
*   **Superpower:** Energi yang tak habis-habisnya *jika* melakukan hal yang disukai.
*   **Tantangan:** Sering terjebak jadi *people pleaser* dan burnout karena melakukan hal yang tidak disukai.
*   **Strategi:** *Wait to Respond*. Jangan mengejar. Tunggu hidup memberikan tanda, lalu respons dengan "Uh-huh" (ya) atau "Un-un" (tidak) dari perutmu.

### 2. The Manifesting Generator (Si Cepat Kilat)
*   **Populasi:** ±33%
*   **Superpower:** Multitasking dan menemukan jalan pintas (efisiensi). Bisa mengerjakan banyak hal sekaligus.
*   **Tantangan:** Sering dianggap tidak fokus atau tidak sabaran.
*   **Strategi:** Sama seperti Generator (*Respond*), tapi perlu *Inform* (memberi tahu) sebelum bertindak cepat agar tidak menabrak orang lain.

### 3. The Projector (Sang Pemandu)
*   **Populasi:** ±20%
*   **Superpower:** Melihat sistem, pola, dan potensi orang lain. Kamu di sini bukan untuk kerja keras fisik, tapi untuk memimpin yang bekerja.
*   **Tantangan:** Merasa *bitter* (pahit) karena saranmu tidak didengar atau dihargai.
*   **Strategi:** *Wait for the Invitation*. Tunggu sampai keahlianmu diakui dan diundang secara khusus. Jangan memberi saran tanpa diminta.

### 4. The Manifestor (Sang Inisiator)
*   **Populasi:** ±9%
*   **Superpower:** Satu-satunya tipe yang bisa memulai sesuatu dari nol tanpa menunggu. Kamu adalah pemantik api.
*   **Tantangan:** Sering merasa dikontrol orang lain, sehingga memicu kemarahan (*anger*).
*   **Strategi:** *To Inform*. Beri tahu orang-orang yang akan terdampak oleh tindakanmu *sebelum* kamu bergerak. Ini bukan minta izin, tapi memberi kabar agar jalanmu mulus.

### 5. The Reflector (Sang Cermin)
*   **Populasi:** ±1%
*   **Superpower:** Objektivitas total. Kamu mencerminkan kesehatan lingkungan di sekitarmu. Kamu bisa merasakan siapa yang jujur dan siapa yang palsu.
*   **Tantangan:** Kecewa (*disappointment*) saat melihat dunia atau komunitas tidak harmonis.
*   **Strategi:** *Wait a Lunar Cycle* (28 Hari). Jangan buru-buru memutuskan hal besar. Beri waktu sebulan untuk merasakan kejelasan.
    `
  },
  {
    slug: "human-design-vs-bazi",
    title: "Human Design vs BaZi: Bedanya Apa & Kenapa Kamu Butuh Keduanya?",
    excerpt: "Human Design adalah kendaraanmu, BaZi adalah peta jalan dan cuacanya. Ketahui 'Siapa Aku' (HD) dan 'Kapan Waktunya' (BaZi) untuk sukses.",
    category: "Deep Dive",
    readTime: "7 menit",
    content: `
### Pernahkah Kamu Merasa Begini?

Kamu sudah hidup sesuai Strategi dan Otoritas Human Design-mu. Kamu *Waiting to Respond* (Generator) atau *Waiting for Invitation* (Projector). Kamu merasa selaras.

Tapi... kenapa hasilnya belum terlihat? Kenapa bisnis masih macet? Kenapa jodoh belum datang?

**Jawabannya mungkin ada di WAKTU (Timing).**

Di sinilah **BaZi (Four Pillars of Destiny)** masuk untuk melengkapi Human Design.

### Analogi Mobil & Jalan Raya

Bayangkan hidupmu seperti perjalanan:

1.  **Human Design adalah MOBIL-mu (Kendaraan).**
    *   Apakah kamu Ferrari (Manifestor) yang cepat?
    *   Apakah kamu Truk Kontainer (Generator) yang kuat angkut beban berat?
    *   Human Design memberitahumu cara menyetir mobil itu agar tidak rusak (*Not-Self*).

2.  **BaZi adalah JALAN RAYA & CUACA-nya.**
    *   Apakah tahun ini jalanan sedang macet (Bad Luck)?
    *   Apakah sedang hujan badai (Clash)?
    *   Atau apakah angin sedang berhembus ke arahmu (Good Luck)?

**Masalahnya:** Meskipun kamu punya Ferrari (Human Design sudah optimal), kalau kamu menyetir saat badai salju di jalan berlumpur (Periode BaZi buruk), kamu tetap akan kesulitan.

Sebaliknya, jika kamu tahu ramalan cuaca, kamu bisa memilih untuk **beristirahat** saat badai, dan **ngebut** saat cuaca cerah.

### Apa Itu BaZi?

BaZi (baca: Pa-Ce) adalah ilmu metafisika Tiongkok kuno yang memetakan energi elemen (Kayu, Api, Tanah, Logam, Air) pada saat kamu lahir.

Ini bukan sekadar ramalan "kamu akan kaya raya". Ini adalah **Analisis Potensi & Waktu**.

BaZi memberitahumu:
*   **Day Master:** Elemen dirimu yang sebenarnya (misal: Api yang butuh Kayu, atau Air yang butuh Logam).
*   **Luck Cycle (Dekade Keberuntungan):** Tema hidupmu per 10 tahun. Apakah ini dekade untuk belajar, mencari uang, atau berkuasa?
*   **Annual Luck (Tahunan):** Energi tahun ini mendukungmu atau menantangmu?

### Kenapa Human Design Saja Tidak Cukup?

Human Design sangat *internal*. Ia memberitahumu tentang "SIAPA" dirimu.
BaZi sangat *eksternal*. Ia memberitahumu tentang "KAPAN" dan "DI MANA".

**Contoh Kasus:**
Seorang **Projector** (HD) ingin memulai bisnis. Secara desain, dia harus menunggu undangan.
*   **Tanpa BaZi:** Dia menunggu bertahun-tahun, undangan datang tapi kecil-kecil. Dia frustrasi.
*   **Dengan BaZi:** Dia tahu bahwa tahun ini adalah tahun "Rob Wealth" (pesaing kuat). Jadi meskipun ada undangan, dia tahu harus ekstra hati-hati atau bermitra dengan orang lain. Dia tidak menyalahkan dirinya sendiri saat hasil belum maksimal, karena dia tahu ini "musim dingin"-nya.

### Kesimpulan: The Ultimate Combo

Ketika kamu menggabungkan keduanya, kamu mendapatkan **Strategic Advantage** yang tidak adil:
1.  Kamu tahu cara mengambil keputusan terbaik (**Human Design**).
2.  Kamu tahu kapan waktu terbaik untuk eksekusi (**BaZi**).

Jangan hanya menyetir dengan benar. Menyetirlah di cuaca yang tepat.

***

**Siap melengkapi peta hidupmu?**
Dapatkan analisis **BaZi Report Add-on** bersamaan dengan **Personal Report** Human Design-mu sekarang.
    `
  },
  {
    slug: "apa-itu-profile",
    title: "Apa Itu Profile? Kostum yang Kamu Pakai Seumur Hidup",
    excerpt: "Kenapa ada orang yang suka menyendiri tapi ada yang jago networking? Jawabannya ada di angka kecil di chart-mu (misal: 1/3, 4/6).",
    category: "Basics",
    readTime: "6 menit",
    content: `
### Bukan Sekadar Angka

Pernahkah kamu merasa punya dua sisi kepribadian yang berbeda? Di satu sisi kamu butuh waktu sendiri ("me time"), tapi di sisi lain kamu ingin koneksi dengan orang banyak?

Dalam Human Design, ini disebut **Profile**. Jika *Type* adalah kendaraanmu, maka *Profile* adalah **kostum** yang kamu pakai saat mengendarainya. Ini adalah peran yang kamu mainkan di panggung kehidupan.

Profile terdiri dari dua angka (misal: 1/3, 2/4, 5/1). Mari kita bedah arti angka-angka ini dengan bahasa sederhana.

### Arti 6 Garis (The 6 Lines)

**Line 1: The Investigator (Si Peneliti)**
*   *Ciri:* Butuh data, riset, dan pondasi yang kuat sebelum bertindak. Tidak nyaman jika tidak paham detailnya.
*   *Mantra:* "Aku butuh tahu segalanya dulu biar aman."

**Line 2: The Hermit (Si Petapa)**
*   *Ciri:* Punya bakat alami yang muncul saat sendirian. Sering "dipanggil" keluar oleh orang lain karena bakatnya terlihat.
*   *Mantra:* "Tinggalkan aku sendiri, kecuali ada hal penting."

**Line 3: The Martyr (Si Pemecah Masalah)**
*   *Ciri:* Belajar lewat *trial and error*. Sering gagal, tapi dari situ dia menemukan apa yang berhasil. Hidupnya penuh eksperimen.
*   *Mantra:* "Gak ada kegagalan, yang ada cuma pelajaran."

**Line 4: The Opportunist (Si Jejaring)**
*   *Ciri:* Kesempatan datang dari lingkaran pertemanan (network). Sangat peduli pada komunitas dan hubungan dekat.
*   *Mantra:* "Temanku adalah hartaku."

**Line 5: The Heretic (Si Penyelamat)**
*   *Ciri:* Dilihat orang sebagai solusi masalah. Punya aura memikat dan sering diproyeksikan harapan tinggi oleh orang asing.
*   *Mantra:* "Aku bisa kasih solusi praktis buat masalahmu."

**Line 6: The Role Model (Si Teladan)**
*   *Ciri:* Hidup dalam 3 fase. Fase 1 (0-30 th) penuh eksperimen seperti Line 3. Fase 2 (30-50 th) mengamati dari jauh. Fase 3 (50+ th) turun gunung jadi mentor bijak.
*   *Mantra:* "Aku sudah pernah mengalami itu, sini aku bimbing."

### Kenapa Ini Penting?

Memahami Profile membantumu memaafkan diri sendiri.
*   Jika kamu **Line 1**, wajar kalau kamu *overthinking* sebelum mulai. Itu bukan ketakutan, itu kebutuhan akan fondasi.
*   Jika kamu **Line 3**, wajar kalau kamu sering gonta-ganti karir. Itu cara belajarmu.

Terimalah kostummu. Jangan paksa *Hermit* untuk jadi *Opportunist*.

***
**Ingin tahu detail kombinasi Profile-mu (misal 1/3 atau 4/6)?**
Cek analisis lengkapnya di **Personal Report**.
    `
  },
  {
    slug: "authority-guide",
    title: "Authority: Cara Mengambil Keputusan Anti-Nyesel",
    excerpt: "Logika seringkali menipu. Temukan 'GPS' internalmu yang sebenarnya agar tidak salah langkah lagi.",
    category: "Basics",
    readTime: "7 menit",
    content: `
### Musuh Terbesar Kita: "Pikiran"

Sejak kecil kita diajarkan: *"Pikirkan baik-baik sebelum bertindak!"* atau *"Buat daftar Pro & Kontra!"*

Di Human Design, **Pikiran (Mind) tidak pernah menjadi pengambil keputusan yang baik**. Pikiran gunanya untuk mengolah data, bukan untuk memutuskan arah hidup.

Lalu siapa bosnya? **Authority** (Otoritas Batin). Ini adalah kecerdasan tubuh yang lebih jujur daripada logikamu.

### Jenis-Jenis Authority

**1. Emotional Authority (Solar Plexus) - 50% Populasi**
*   *Kunci:* **Tunggu Emosi Reda.**
*   *Jebakan:* Memutuskan saat sedang *happy* banget atau sedih banget.
*   *Tips:* Jangan pernah bilang "Ya" saat itu juga. Tidurlah dulu semalam. Kejelasan datang saat air kolam emosimu tenang.

**2. Sacral Authority (Generator/MG) - 35% Populasi**
*   *Kunci:* **Respon Gut (Perut).**
*   *Bahasa:* "Uh-huh" (Ya) atau "Un-un" (Tidak).
*   *Tips:* Minta orang bertanya padamu pertanyaan Ya/Tidak. "Mau makan ini?" -> Perutmu akan langsung bereaksi menarik (tertarik) atau menolak (mual/lelah). Itu jujur.

**3. Splenic Authority (Insting) - 10% Populasi**
*   *Kunci:* **Bisikan Pertama.**
*   *Jebakan:* Logika yang menimpa insting.
*   *Tips:* Insting itu cepat, pelan, dan cuma bicara sekali. Kalau kamu merasa "Jangan lewat jalan ini" tanpa alasan logis, ikuti. Detik berikutnya, logikamu akan mendebatnya. Abaikan logika itu.

**4. Ego/Heart Authority**
*   *Kunci:* **Apa Untungnya Buatku?**
*   *Tips:* Apakah kamu benar-benar *menginginkan* ini? Apakah kamu punya energi (willpower) untuk menyelesaikannya? Jangan komitmen kalau hatimu tidak "bernyanyi".

**5. Self-Projected Authority (Projector)**
*   *Kunci:* **Dengarkan Suaramu Sendiri.**
*   *Tips:* Kamu perlu ngobrol. Bukan minta saran, tapi agar kamu bisa *mendengar* dirimu sendiri bicara. Kebenaran keluar dari mulutmu tanpa disaring otak.

### Hidup Tanpa Penyesalan

Bayangkan berapa banyak keputusan salah yang kamu buat karena "Kata orang bagus" atau "Logikanya sih untung", padahal hatimu menolak?

Mulai hari ini, coba dengarkan Authority-mu. Awalnya aneh, tapi tubuhmu tidak pernah berbohong.

***
**Bingung Authority-mu yang mana?**
Buat chart gratismu di halaman depan, lalu pelajari cara pakainya di **Personal Report**.
    `
  },
  {
    slug: "projector-guide",
    title: "Projector Guide: Sukses Tanpa Kerja Keras (Hustle)",
    excerpt: "Kamu sering merasa malas atau tidak bertenaga dibandingkan orang lain? Mungkin kamu adalah Projector yang sedang mencoba menjadi Generator.",
    category: "Deep Dive",
    readTime: "6 menit",
    content: `
### Mitos "Hard Work"

Dunia kita dibangun oleh para Generator (70% populasi) yang punya energi baterai tak terbatas untuk bekerja. Maka, budaya kita memuja "Kerja Keras", "Lembur", dan "Hustle".

Lalu datanglah kamu, seorang **Projector** (20% populasi).

Kamu mencoba mengikuti ritme mereka. Kamu lembur, kamu *push* dirimu. Hasilnya? Kamu sakit. Kamu *bitter* (pahit/getir). Kamu merasa ada yang salah dengan dirimu.

### Peranmu Bukan "Kuli", Tapi "Mandor"

Projector tidak didesain untuk menghasilkan energi tenaga kerja. Kamu didesain untuk **MEMIMPIN, MEMANDU, dan MENGEFISIENSIKAN** energi orang lain.

*   Generator adalah *Builder* (Pembangun).
*   Projector adalah *Architect* (Arsitek).

Arsitek tidak ikut mengaduk semen seharian. Dia datang, melihat, memberi arahan presisi, lalu istirahat. Jika Arsitek ikut ngaduk semen, dia kelelahan dan proyeknya berantakan karena tidak ada yang mengawasi *big picture*.

### Rahasia Sukses Projector

1.  **Stop Initiating (Berhenti Mengejar):** Saat kamu memaksa memberi saran atau melamar pekerjaan secara agresif, auramu terasa "menusuk" bagi orang lain. Mereka akan menolakmu.
2.  **Tunggu Undangan (The Invitation):** Keajaibanmu hanya keluar saat ada yang bertanya: *"Menurutmu bagaimana?"* atau *"Bisa bantu aku?"*. Undangan adalah tanda karpet merah digelar untukmu.
3.  **Asah Skill:** Sambil menunggu, pelajari satu sistem sampai kamu jadi master. Orang mengundangmu karena kamu *ahli* melihat apa yang mereka tidak lihat.
4.  **Istirahat Adalah Produktivitas:** Kamu butuh tidur lebih banyak dan waktu sendirian untuk membuang energi orang lain yang kamu serap seharian.

Kamu berharga karena **wawasanmu**, bukan karena seberapa banyak keringat yang kamu keluarkan.

***
**Ingin panduan karir khusus Projector?**
Temukan strategi detailnya di **Personal Report** Human Design.
    `
  },
  {
    slug: "generator-burnout",
    title: "Generator Burnout: Tanda Kamu Hidup 'Not-Self'",
    excerpt: "Punya energi tak terbatas bukan berarti tidak bisa lelah. Jika kamu sering merasa frustrasi dan macet, baca ini.",
    category: "Deep Dive",
    readTime: "5 menit",
    content: `
### Jebakan "Bisa" vs "Mau"

Sebagai Generator atau Manifesting Generator, kamu punya Sacral Center—baterai kehidupan yang sangat kuat. Masalahnya, karena kamu punya energi ini, orang-orang suka "nebeng".

*"Bisa bantuin ini gak?"*
*"Bisa handle proyek ini gak?"*

Kamu jawab "Bisa". Lalu kamu kerjakan. Di tengah jalan, kamu merasa berat, kesal, dan ingin berhenti tapi tidak enak hati. Akhirnya kamu **Burnout**.

Ini terjadi karena kamu menggunakan energimu untuk hal yang tidak membuat *Sacral*-mu menyala.

### Tanda Sacral-mu Mati (Frustrasi)

Emosi penanda (Signature) Generator adalah **Satisfaction** (Kepuasan).
Emosi penanda Not-Self adalah **Frustration** (Frustrasi).

Jika kamu bangun pagi dengan perasaan *"Hah... harus kerja lagi"*, itu tanda bahaya. Energimu sedang bocor. Generator yang sehat bangun dengan perasaan *"Yes! Hari ini mau ngelarin ini!"*.

### Cara Keluar dari Burnout

1.  **Berhenti Inisiatif Kosong:** Jangan mencari-cari kerjaan. Tunggu hidup memberikan stimulus (email masuk, ajakan teman, masalah di depan mata).
2.  **Cek Respon Gut:** Sebelum ambil proyek, tanya perutmu. "Apakah aku *bersemangat* melakukan ini?".
    *   Jika rasanya datar/berat -> Tolak (atau delegasikan).
    *   Jika rasanya *excited* -> Gas.
3.  **Habiskan Energimu:** Generator harus tidur dalam keadaan lelah fisik yang puas (satisfied exhaustion). Jika kamu lelah tapi pikiran masih *racing* (cemas), berarti energimu hari itu tidak tersalurkan dengan benar.

Energimu adalah mata uang termahalmu. Jangan diobral untuk hal yang tidak kamu cintai.

***
**Pelajari cara memaksimalkan energimu.**
Dapatkan tips vitalitas dan kesehatan di **Personal Report**.
    `
  },
  {
    slug: "manifestor-anger",
    title: "Manifestor & Kemarahan: Kenapa Orang Lain Lambat Sekali?",
    excerpt: "Kamu sering merasa dikontrol, dibatasi, atau kesal karena orang lain tidak bisa mengikuti kecepatanmu? Ini solusinya.",
    category: "Deep Dive",
    readTime: "5 menit",
    content: `
### Si Penyendiri yang Powerful

Manifestor adalah tipe energi minoritas (9%) yang punya akses langsung untuk "bertindak". Kamu tidak perlu menunggu undangan (Projector) atau menunggu respon (Generator). Kamu dapat ide -> Kamu jalan.

Tapi, kenapa hidup terasa penuh konflik?

### Akar Kemarahan (Anger)

Tema *Not-Self* Manifestor adalah **Marah**. Kemarahan ini muncul karena dua hal:
1.  **Orang lain mencoba mengendalikanmu.** ("Jangan lakukan itu", "Lapor dulu dong").
2.  **Orang lain terlalu lambat.** Kamu sudah lari 100km/jam, orang lain masih pakai sepatu.

Karena auramu tertutup dan menolak (repelling/closed aura), orang sering tidak paham apa maumu. Akibatnya, mereka jadi curiga dan mencoba mengawasimu. Ini yang bikin kamu marah.

### Kunci Kedamaian: Menginformasikan (To Inform)

Banyak Manifestor benci "laporan". Rasanya seperti minta izin.

Tapi, strategi **To Inform** bukan minta izin. Itu seperti menyalakan lampu sein sebelum belok.
*"Aku mau keluar sebentar beli kopi."*
*"Aku akan ubah sistem kerja mulai besok."*

Saat kamu memberi tahu (inform), orang lain merasa aman. Mereka berhenti curiga, berhenti menghalangimu, dan justru menyingkir memberimu jalan.

Kemarahanmu adalah tanda bahwa kamu bergerak tanpa menyalakan lampu sein, sehingga terjadi tabrakan.

### Tips untuk Manifestor:
*   Jangan menunggu diajak. Mulailah.
*   Beri kabar pada orang yang akan terdampak tindakanmu.
*   Istirahatlah sesuka hatimu sebelum memulai *burst* energi berikutnya. Kamu bukan kuda beban yang harus kerja 9-5.

***
**Ingin tahu cara memimpin tanpa resistensi?**
Pelajari strategi Manifestor-mu di **Personal Report**.
    `
  },
  {
    slug: "business-by-design",
    title: "Bisnis Sesuai Desain: Solo vs Team?",
    excerpt: "Tidak semua orang cocok jadi CEO, dan tidak semua orang cocok jadi Eksekutor. Di mana posisimu?",
    category: "Deep Dive",
    readTime: "7 menit",
    content: `
### Salah Kaprah Dunia Bisnis

Kita sering diajarkan bahwa untuk sukses bisnis harus bisa segalanya: Punya visi, bisa marketing, bisa operasional, bisa eksekusi detail.

Padahal, secara energetik, kita punya peran spesifik. Memaksakan peran yang salah bikin bisnis macet.

### Peran Berdasarkan Tipe Energi

**1. The Visionary Founder (Manifestor)**
*   *Peran:* Memulai ide baru, mendobrak pasar, membuka jalan.
*   *Gaya Kerja:* Sprint cepat, lalu istirahat.
*   *Tim Ideal:* Butuh Generator/MG untuk eksekusi jangka panjang. Manifestor sering bosan setelah *launching*. Jangan paksa dirimu maintain operasional harian.

**2. The System Optimizer & Guide (Projector)**
*   *Peran:* Manajer, Konsultan, CEO yang mengarahkan efisiensi.
*   *Gaya Kerja:* Melihat inefisiensi dan memperbaikinya. Fokus 1-on-1.
*   *Tim Ideal:* Butuh "pasukan" (Generators) yang energinya bisa diarahkan. Projector tidak boleh terjebak di "dapur" produksi.

**3. The Master Builder (Generator)**
*   *Peran:* Spesialis yang membangun produk terbaik. Ahli di bidangnya.
*   *Gaya Kerja:* Step-by-step, konsisten, mastery.
*   *Tim Ideal:* Bisa kerja solo atau tim, asalkan cintai proses pembuatannya. Hati-hati jangan sampai kehabisan waktu untuk *marketing* karena terlalu asik *building*.

**4. The Super Agat (Manifesting Generator)**
*   *Peran:* Growth Hacker, Serial Entrepreneur.
*   *Gaya Kerja:* Cepat, potong kompas, handle banyak proyek.
*   *Tim Ideal:* Butuh asisten (atau Projector) untuk membereskan detail yang kamu lewatkan karena terlalu ngebut.

### Solo atau Team?
*   **Solo:** Paling cocok untuk MG dan Generator di tahap awal, karena punya energi sendiri.
*   **Team:** Wajib untuk Projector dan Manifestor jika ingin scale-up, karena energimu tidak konsisten untuk eksekusi harian.

Kenali desainmu, rekrut orang yang melengkapi kekurangan energimu.

***
**Dapatkan panduan karir & bisnis lengkap.**
Cek bagian "Business Profile" di **Personal Report**.
    `
  },
  {
    slug: "love-language-design",
    title: "Love Language by Design: Cara Mencintai Sesuai Tipe Energi",
    excerpt: "Apakah bahasa cintamu 'Quality Time' atau 'Words of Affirmation'? Ternyata tipe energimu mempengaruhi cara kamu ingin dicintai.",
    category: "Deep Dive",
    readTime: "6 menit",
    content: `
### Asmara & Energi

Kita sering bingung kenapa pasangan kita tidak merespon cinta yang kita berikan. Padahal, mungkin kita sedang memberi "bensin" ke mobil diesel. Tidak cocok.

Setiap Tipe Energi dalam Human Design memiliki kebutuhan dasar dalam hubungan.

### Kebutuhan Dasar per Tipe

**1. Projector: Butuh Diakui & Didengar**
*   *Bahasa Cinta:* **Words of Affirmation (Pengakuan Spesifik) & Quality Time (Focus).**
*   *Mantra:* "Aku melihatmu. Aku menghargai wawasanmu."
*   *Pantangan:* Jangan abaikan mereka saat mereka bicara. Jangan potong pembicaraan mereka. Projector butuh fokus 100% saat bersama.

**2. Generator: Butuh Respon & Kegiatan Bersama**
*   *Bahasa Cinta:* **Acts of Service (Doing) & Physical Touch.**
*   *Mantra:* "Yuk kita lakukan ini bareng-bareng!"
*   *Pantangan:* Jangan tanya "Apa kabar?" (terlalu abstrak). Tanya "Mau makan bakso gak?" (pertanyaan Ya/Tidak yang bisa direspon Sacral).

**3. Manifesting Generator: Butuh Kebebasan & Kecepatan**
*   *Bahasa Cinta:* **Freedom (Ruang Gerak) & Shared Adventure.**
*   *Mantra:* "Aku dukung kamu, kabari aja kalau udah beres."
*   *Pantangan:* Jangan suruh mereka pelan-pelan atau mengulang-ulang hal yang sama. Mereka akan bosan dan marah.

**4. Manifestor: Butuh Rasa Hormat & Ketenangan**
*   *Bahasa Cinta:* **Respect (Dibiarkan Memimpin) & Peace.**
*   *Mantra:* "Aku percaya keputusanmu. Kabari aku ya."
*   *Pantangan:* Jangan interogasi mereka ("Kamu mau kemana? Ngapain? Sama siapa?"). Itu memicu kemarahan. Biarkan mereka menginformasikanmu.

**5. Reflector: Butuh Waktu & Lingkungan Sehat**
*   *Bahasa Cinta:* **Patience (Kesabaran) & Safe Space.**
*   *Mantra:* "Ambil waktu sebanyak yang kamu butuh."
*   *Pantangan:* Jangan buru-buru meminta komitmen.

Cintai pasanganmu bukan dengan cara yang *kamu* mau, tapi dengan cara yang *desain mereka* butuhkan.

***
**Analisis kecocokan hubunganmu?**
Cek **Relationship Compatibility Report** (Coming Soon) atau pelajari dasarnya di **Personal Report**.
    `
  },
  {
    slug: "emotional-vs-non-emotional",
    title: "Kenapa Pasanganku 'Cuek' atau 'Drama'? (Emotional vs Non-Emotional)",
    excerpt: "Memahami dinamika Solar Plexus Center adalah kunci hubungan yang awet. Apakah kamu si 'Empath' atau si 'Moody'?",
    category: "Deep Dive",
    readTime: "7 menit",
    content: `
### Konflik Terbesar dalam Hubungan

Pernahkah kamu merasa energimu "terseret" emosi pasangan? Kalau dia marah, kamu ikutan stres. Kalau dia sedih, kamu ikutan nangis.

Atau sebaliknya, kamu merasa pasanganmu dingin banget (*cold*) saat kamu sedang butuh validasi emosional?

Ini adalah dinamika **Defined vs Undefined Solar Plexus (Emotional Center)**. 50% populasi punya ini berwarna (Defined), 50% putih (Undefined).

### Si Pembawa Ombak (Defined Solar Plexus)
*   **Ciri:** Emosimu naik turun seperti ombak laut, tanpa alasan jelas. Hari ini *happy*, besok *melancholy*. Itu alami.
*   **Peran:** Kamu membawa kedalaman rasa (passion) ke dalam hubungan.
*   **Tanggung Jawab:** Jangan jadikan pasanganmu "tempat sampah" emosi saat sedang *bad mood*. Bilang: *"Aku lagi nggak mood, butuh waktu sendiri. Bukan salah kamu."*

### Si Cermin Emosi (Undefined Solar Plexus)
*   **Ciri:** Sebenarnya kamu tenang (cool). Tapi saat ada orang emosional di dekatmu, kamu menyerap emosi itu 2x lipat lebih kuat.
*   **Peran:** Kamu adalah *Empath*. Kamu bisa merasakan apa yang orang lain rasakan.
*   **Jebakan:** Kamu sering menghindari konflik (konfrontasi) karena takut "terseret" ombak emosi pasangan. Kamu jadi "Nice Guy/Girl" yang memendam masalah.

### Solusi Harmonis

1.  **Jika kamu Defined (Ombak):** Sadari bahwa perasaanmu adalah tanggung jawabmu. Jangan paksa pasanganmu menyelesaikannya saat itu juga. Tunggu tenang.
2.  **Jika kamu Undefined (Cermin):** Saat kamu tiba-tiba marah atau sedih, tanya: *"Apakah ini punyaku?"*. Biasanya bukan. Menyingkirlah sebentar dari pasanganmu. Kembalilah saat aura sudah netral.

Berhenti menyalahkan pasanganmu karena "terlalu sensitif" atau "terlalu dingin". Itu cuma mekanika energi.

***
**Cek chart pasanganmu sekarang.**
Lihat apakah Solar Plexus-nya berwarna atau putih di **Personal Report**.
    `
  },
  {
    slug: "bazi-luck-cycle",
    title: "The Luck Cycle: Kenapa Tahun Ini Terasa Berat?",
    excerpt: "Bukan sial, mungkin kamu sedang berada di 'Musim Dingin' kehidupanmu. Kenali siklus keberuntungan BaZi agar tidak salah strategi.",
    category: "Deep Dive",
    readTime: "6 menit",
    content: `
### Hidup Itu Ada Musimnya

Pernahkah kamu merasa ada tahun di mana semua yang kamu sentuh jadi emas? Tapi ada tahun lain di mana usaha sekeras apapun hasilnya nol?

Dalam BaZi, ini disebut **Luck Cycle (Pilar Keberuntungan)**.

Keberuntungan bukan hal mistis yang acak. Itu adalah **Aliran Energi Waktu**. Sama seperti petani:
*   Ada waktu menanam (Spring).
*   Ada waktu panen (Autumn).
*   Ada waktu istirahat (Winter).

Jika kamu memaksa menanam padi di tengah badai salju (Winter), kamu akan gagal dan lelah. Bukan karena kamu petani yang buruk, tapi karena *waktunya salah*.

### 10-Year Luck Pillar (Dekade)

Setiap 10 tahun, tema hidupmu berubah.
*   **Dekade Wealth:** Fokus cari uang, peluang bisnis terbuka.
*   **Dekade Power/Career:** Naik jabatan, status sosial meningkat, tapi tekanan kerja tinggi.
*   **Dekade Resource/Study:** Waktu terbaik untuk belajar, ambil S2, atau merenung. Bisnis mungkin melambat, tapi ilmu bertambah.
*   **Dekade Influence/Output:** Waktu untuk berkarya, tampil di panggung, dan berekspresi.

### Annual Luck (Tahunan)

Di dalam dekade itu, ada cuaca tahunan.
*   **Tahun Clash (Tabrakan):** Perubahan mendadak. Bisa pindah rumah, putus cinta, atau kecelakaan (hati-hati di jalan). Clash memaksamu keluar dari zona nyaman.
*   **Tahun Harmony (Kombinasi):** Hidup terasa mulus, banyak bantuan datang (Nobleman).

### Strategi "Surfing"

Jangan melawan ombak.
*   Jika sedang di **Bad Luck Cycle**: Bertahan (Defense). Belajar, hemat uang, jaga kesehatan. Jangan ekspansi bisnis gila-gilaan.
*   Jika sedang di **Good Luck Cycle**: Serang (Offense). Ambil risiko, investasi, kerja keras. Hasilnya akan berlipat ganda.

BaZi memberitahumu kapan harus ngegas, kapan harus ngerem.

***
**Cek siklus keberuntunganmu tahun ini.**
Dapatkan analisisnya di **BaZi Report Add-on**.
    `
  },
  {
    slug: "bazi-day-master",
    title: "Elemen Diri (Day Master): Kamu Api, Air, atau Kayu?",
    excerpt: "Inti dari chart BaZi adalah Day Master. Ini mewakili karakter aslimu yang tidak bisa diubah.",
    category: "Basics",
    readTime: "5 menit",
    content: `
### Siapa Kamu Sebenarnya?

Dalam astrologi barat, kita mengenal Zodiak (Aries, Taurus, dll). Dalam BaZi, identitas utamamu ditentukan oleh **Day Master** (Elemen Hari Lahir).

Ada 5 Elemen, masing-masing punya polaritas Yin (Kecil/Lembut) dan Yang (Besar/Kuat). Total ada 10 Day Master.

### 5 Elemen Dasar

**1. Kayu (Wood) - Sang Pertumbuhan**
*   *Jia (Kayu Yang):* Pohon Raksasa. Kokoh, keras kepala, pelindung, lurus, tidak fleksibel.
*   *Yi (Kayu Yin):* Tanaman Merambat/Bunga. Fleksibel, diplomatik, pintar cari jalan keluar, butuh sandaran.

**2. Api (Fire) - Sang Penerang**
*   *Bing (Api Yang):* Matahari. Hangat, dermawan, rutin/konsisten, ingin dilihat, kadang terlalu panas (blak-blakan).
*   *Ding (Api Yin):* Lilin/Api Unggun. Inspiratif, sentimental, meledak-ledak tapi cepat padam, butuh fokus.

**3. Tanah (Earth) - Sang Wadah**
*   *Wu (Tanah Yang):* Gunung/Batu Karang. Stabil, dapat dipercaya, lambat bergerak, menyimpan rahasia.
*   *Ji (Tanah Yin):* Tanah Kebun. Subur, pengasuh (nurturing), serba bisa, kadang terlalu memikirkan orang lain.

**4. Logam (Metal) - Sang Eksekutor**
*   *Geng (Logam Yang):* Kapak/Pedang. Tangguh, adil, tajam, suka keadilan, teman setia, tapi kasar.
*   *Xin (Logam Yin):* Perhiasan/Emas. Cantik, ingin dihargai, perfectionist, tajam (kata-katanya menusuk), butuh validasi.

**5. Air (Water) - Sang Arus**
*   *Ren (Air Yang):* Samudra/Ombak. Dinamis, energik, ambisius, sulit dibendung, berpikiran luas.
*   *Gui (Air Yin):* Embun/Hujan. Misterius, imajinatif, perasa, mudah berubah bentuk (adaptif), pemikir dalam.

Mengetahui Day Master-mu membantumu memahami kekuatan dan kelemahan alamimu.

***
**Apa Day Master kamu?**
Temukan jawabannya di **BaZi Report Add-on**.
    `
  }
];
