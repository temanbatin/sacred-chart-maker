import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Apa itu Human Design?',
    answer: 'Human Design adalah sistem yang menggabungkan astrologi, I\'Ching, Kabbalah, sistem chakra Hindu-Brahmin, dan fisika kuantum. Sistem ini memberikan peta unik tentang bagaimana energimu bekerja dan bagaimana kamu bisa hidup selaras dengan desain sejatimu.',
  },
  {
    question: 'Apakah waktu lahir harus akurat?',
    answer: 'Idealnya ya, karena waktu lahir mempengaruhi posisi planet yang menentukan chart-mu. Namun, jika kamu tidak tahu waktu pasti, gunakan perkiraan terdekat. Perbedaan beberapa jam bisa mengubah beberapa aspek chart.',
  },
  {
    question: 'Apa perbedaan antara Type, Strategy, dan Authority?',
    answer: 'Type menunjukkan energi dasarmu (Generator, Projector, Manifestor, Reflector, atau Manifesting Generator). Strategy adalah cara terbaik kamu berinteraksi dengan dunia. Authority adalah panduan internal untuk membuat keputusan yang benar untukmu.',
  },
  {
    question: 'Bagaimana cara menggunakan informasi Human Design?',
    answer: 'Mulailah dengan memahami Type-mu dan ikuti Strategy-nya dalam kehidupan sehari-hari. Gunakan Authority-mu untuk membuat keputusan penting. Human Design bukan tentang mengubah diri, tapi tentang memahami dan menerima siapa dirimu sebenarnya.',
  },
  {
    question: 'Apakah Human Design bisa berubah seiring waktu?',
    answer: 'Tidak, chart Human Design-mu tetap sama sejak lahir hingga akhir hayat. Yang berubah adalah bagaimana kamu memahami dan menjalani desainmu dengan lebih baik seiring pengalaman dan kesadaran.',
  },
  {
    question: 'Apakah hasil perhitungan ini gratis?',
    answer: 'Ya, perhitungan dasar Human Design sepenuhnya gratis. Kami ingin setiap orang memiliki akses untuk memahami desain sejati mereka.',
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
          Temukan jawaban atas pertanyaan umum tentang Human Design
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
