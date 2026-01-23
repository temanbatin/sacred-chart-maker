import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import reportSS1 from "@/assets/Report SS.jpg";
import reportSS2 from "@/assets/Report SS 2.jpg";
import reportSS3 from "@/assets/Report SS 3.jpg";

const faqs = [
  {
    question: 'Apa bedanya chart gratis dengan laporan berbayar?',
    answer: 'Chart gratis memberikan gambaran umum tipe, strategi, dan otoritas kamu. Laporan berbayar (100+ halaman) menjelaskan secara detail tentang misi hidupmu, penjelasan setiap gate & center, strategi karir yang tepat, panduan relasi, dan langkah konkret untuk menjalani desainmu sehari-hari.',
    showGallery: true,
  },
  {
    question: 'Apakah Human Design Report ini akurat?',
    answer: 'Human Design Report kami menggunakan perhitungan yang sama dengan sistem yang digunakan oleh praktisi Human Design profesional di seluruh dunia. Akurasi sangat bergantung pada ketepatan data kelahiran Anda (tanggal, waktu, dan tempat lahir). Ribuan pengguna kami telah merasakan resonansi mendalam dengan hasil report mereka.'
  },
  {
    question: 'Berapa lama laporan dikirim?',
    answer: 'Laporan personal kamu akan dikirim ke email secara instan (otomatis dalam hitungan menit) setelah pembayaran terverifikasi.',
  },
  {
    question: 'Bagaimana jika laporan tidak sesuai harapan?',
    answer: 'Kami memberikan garansi 100% pembuatan report ulang jika ada kesalahan atau jika report tidak sesuai dengan data yang kamu berikan. Cukup hubungi support kami via WhatsApp dengan bukti kesalahan.',
  },
  {
    question: 'Bisakah saya melihat contoh laporan sebelum membeli?',
    answer: 'Ya! Saat kamu klik "Dapatkan Laporan Lengkap", kami menampilkan preview beberapa halaman dan sample analisis yang sudah disesuaikan dengan chart unikmu.',
    showGallery: true,
  },
  {
    question: 'Apakah saya harus percaya astrologi atau spiritual untuk menggunakan ini?',
    answer: 'Tidak sama sekali. Human Design adalah sistem yang menggabungkan berbagai ilmu termasuk genetika, fisika kuantum, astrologi, I-Ching, dan Kabbalah. Anda bisa menggunakannya sebagai alat self-awareness yang pragmatis tanpa harus percaya aspek spiritual. Banyak profesional dan eksekutif menggunakan Human Design sebagai framework untuk optimasi performa dan produktivitas.'
  },
  {
    question: 'Apa bedanya dengan konsultasi psikolog atau life coach?',
    answer: 'Human Design Report memberikan blueprint unik tentang cara kerja energi Anda yang sudah ditentukan sejak lahir. Ini bukan pengganti psikolog (untuk terapi mental health) atau life coach (untuk goal setting), tapi complementary tool yang memberikan self-knowledge mendalam. Dengan harga one-time yang jauh lebih terjangkau dibanding sesi coaching berulang (Rp 500k-2jt per sesi), Anda mendapat panduan komprehensif yang bisa dibaca berulang kali.'
  },
  {
    question: 'Apakah waktu lahir harus akurat?',
    answer: 'Idealnya ya, karena waktu lahir mempengaruhi posisi planet yang menentukan chart-mu. Waktu lahir sangat penting untuk akurasi maksimal, terutama untuk menentukan Otoritas (cara membuat keputusan) Anda. Jika tidak yakin, coba cek akte kelahiran atau tanya orang tua/rumah sakit tempat lahir. Jika benar-benar tidak tahu, gunakan perkiraan terdekat - Anda tetap bisa mendapat insight berharga dari Tipe dan Profil.',
  },
];

const reportSlides = [
  { img: reportSS1, title: "📋 Daftar Isi Lengkap", desc: "100+ halaman terstruktur rapi, mudah dipahami" },
  { img: reportSS2, title: "⚡ Langkah Praktis Sesuai Authority-mu", desc: "Panduan keputusan berdasarkan desain unikmu" },
  { img: reportSS3, title: "🎯 Strategi Kehidupan Personal", desc: "Kekuatan unikmu untuk karir & relasi" },
];

const ReportGallery = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <div className="mt-4 relative">
      <div className="overflow-hidden rounded-lg border border-accent/30">
        <img
          src={reportSlides[slideIndex].img}
          alt={reportSlides[slideIndex].title}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
      {/* Navigation */}
      <button
        aria-label="Previous slide"
        onClick={() => setSlideIndex((prev) => (prev === 0 ? reportSlides.length - 1 : prev - 1))}
        className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => setSlideIndex((prev) => (prev === reportSlides.length - 1 ? 0 : prev + 1))}
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      {/* Caption */}
      <div className="mt-2 text-center">
        <p className="text-accent text-sm font-medium">{reportSlides[slideIndex].title}</p>
        <p className="text-muted-foreground text-xs">{reportSlides[slideIndex].desc}</p>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-2">
        {reportSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSlideIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${idx === slideIndex ? 'bg-accent' : 'bg-muted-foreground/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export const FAQSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gradient-fire">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Temukan jawaban atas pertanyaan umum tentang Human Design & laporan kami
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card rounded-2xl px-6 border-none"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-accent hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
                {faq.showGallery && <ReportGallery />}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
