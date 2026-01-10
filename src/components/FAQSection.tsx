import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Apa bedanya chart gratis dengan laporan berbayar?',
    answer: 'Chart gratis memberikan gambaran umum tipe, strategi, dan otoritas kamu. Laporan berbayar (30+ halaman) menjelaskan secara detail tentang misi hidupmu, penjelasan setiap gate & center, strategi karir yang tepat, panduan relasi, dan langkah konkret untuk menjalani desainmu sehari-hari.',
  },
  {
    question: 'Bagaimana jika laporan tidak sesuai harapan?',
    answer: 'Kami memberikan garansi 100% uang kembali dalam 7 hari jika kamu merasa laporan tidak bermanfaat. Cukup hubungi support kami via WhatsApp, dan kami akan memproses refund tanpa pertanyaan.',
  },
  {
    question: 'Berapa lama laporan dikirim?',
    answer: 'Laporan personal kamu akan dikirim ke email dalam maksimal 24 jam setelah pembayaran terverifikasi. Biasanya lebih cepat dari itu!',
  },
  {
    question: 'Bisakah saya melihat contoh laporan sebelum membeli?',
    answer: 'Ya! Saat kamu klik "Dapatkan Laporan Lengkap", kami menampilkan preview beberapa halaman dan sample analisis yang sudah disesuaikan dengan chart unikmu.',
  },
  {
    question: 'Apakah waktu lahir harus akurat?',
    answer: 'Idealnya ya, karena waktu lahir mempengaruhi posisi planet yang menentukan chart-mu. Namun, jika kamu tidak tahu waktu pasti, gunakan perkiraan terdekat. Perbedaan beberapa jam bisa mengubah beberapa aspek chart.',
  },
  {
    question: 'Apa itu Human Design?',
    answer: 'Human Design adalah sistem yang menggabungkan astrologi, I\'Ching, Kabbalah, sistem chakra, dan fisika kuantum. Sistem ini memberikan peta unik tentang bagaimana energimu bekerja dan bagaimana kamu bisa hidup selaras dengan desain sejatimu.',
  },
];

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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
