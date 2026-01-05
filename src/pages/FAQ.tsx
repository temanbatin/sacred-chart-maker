import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "Apa itu Human Design?",
    answer: "Human Design adalah sistem pengetahuan yang menggabungkan astrologi, I Ching, Kabbalah, sistem chakra Hindu-Brahmin, dan fisika kuantum. Sistem ini memberikan peta unik tentang cara kerja energi dan potensi seseorang berdasarkan waktu dan tempat kelahiran."
  },
  {
    question: "Bagaimana cara mendapatkan chart Human Design saya?",
    answer: "Anda cukup memasukkan data kelahiran lengkap (tanggal, waktu, dan tempat lahir) di halaman utama Teman Batin. Sistem kami akan menghasilkan chart Human Design Anda secara otomatis dan gratis."
  },
  {
    question: "Apakah layanan chart gratis di Teman Batin benar-benar gratis?",
    answer: "Ya, layanan pembuatan chart Human Design dasar di Teman Batin sepenuhnya gratis. Anda dapat mengakses chart dan informasi dasar tentang tipe, strategi, dan otoritas Anda tanpa biaya."
  },
  {
    question: "Mengapa waktu lahir penting untuk chart Human Design?",
    answer: "Waktu lahir sangat penting karena posisi planet dan gate berubah setiap beberapa menit. Waktu yang akurat menghasilkan chart yang lebih tepat. Jika Anda tidak tahu waktu pasti, gunakan perkiraan terbaik atau 12:00 siang."
  },
  {
    question: "Apa perbedaan antara tipe-tipe Human Design?",
    answer: "Ada 5 tipe utama: Manifestor (inisiator), Generator (pekerja), Manifesting Generator (multi-tasker), Projector (pemandu), dan Reflector (cermin). Setiap tipe memiliki strategi dan cara berinteraksi dengan dunia yang unik."
  },
  {
    question: "Apa itu strategi dan otoritas dalam Human Design?",
    answer: "Strategi adalah cara optimal setiap tipe untuk mengambil keputusan dan berinteraksi dengan dunia. Otoritas adalah 'suara dalam' atau sistem pengambilan keputusan personal yang membantu Anda membuat pilihan yang benar untuk diri sendiri."
  },
  {
    question: "Bisakah Human Design berubah seiring waktu?",
    answer: "Tidak, chart Human Design Anda ditentukan saat lahir dan tidak berubah. Yang berubah adalah pemahaman dan kemampuan Anda untuk menghayati desain unik Anda seiring waktu."
  },
  {
    question: "Apakah Human Design adalah ramalan atau prediksi?",
    answer: "Tidak, Human Design bukan tentang meramal masa depan. Ini adalah alat untuk memahami mekanika energi unik Anda, potensi bawaan, dan cara optimal untuk menjalani hidup sesuai dengan desain asli Anda."
  },
  {
    question: "Apa saja layanan berbayar yang tersedia di Teman Batin?",
    answer: "Kami menawarkan konsultasi personal dengan analis bersertifikat, laporan chart mendalam, workshop online, dan paket premium dengan fitur tambahan. Kunjungi halaman layanan kami untuk informasi lengkap."
  },
  {
    question: "Bagaimana cara menghubungi tim Teman Batin?",
    answer: "Anda dapat menghubungi kami melalui halaman Hubungi Kami, email ke support@temanbatin.com, atau WhatsApp di nomor yang tertera di website. Tim kami siap membantu pada jam kerja."
  },
  {
    question: "Apakah data saya aman di Teman Batin?",
    answer: "Ya, kami sangat menjaga privasi dan keamanan data Anda. Silakan baca Kebijakan Privasi kami untuk informasi lengkap tentang bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda."
  },
  {
    question: "Bagaimana kebijakan pengembalian dana Teman Batin?",
    answer: "Kami memiliki kebijakan pengembalian dana yang jelas untuk layanan berbayar. Secara umum, pengembalian dapat diajukan dalam 7 hari untuk layanan yang belum digunakan. Baca halaman Kebijakan Pengembalian Dana untuk detail lengkap."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Pertanyaan yang Sering Diajukan</h1>
            <p className="text-lg text-muted-foreground">
              Temukan jawaban untuk pertanyaan umum seputar Human Design dan layanan Teman Batin
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-accent hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 p-6 bg-secondary/50 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Masih punya pertanyaan?</h2>
            <p className="text-muted-foreground mb-4">
              Jika Anda tidak menemukan jawaban yang dicari, jangan ragu untuk menghubungi tim kami.
            </p>
            <a 
              href="/hubungi-kami" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
