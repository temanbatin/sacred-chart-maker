import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Check, X, ArrowRight, Star, Shield, Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const painPoints = [
  'Merasa hidup tidak sesuai dengan diri sejati Anda',
  'Sering merasa kelelahan atau burnout tanpa tahu penyebabnya',
  'Kesulitan membuat keputusan yang tepat',
  'Merasa tidak dipahami oleh orang lain',
  'Mencari tujuan hidup yang sebenarnya',
];

const wrongSolutions = [
  'Mengikuti saran orang lain yang tidak sesuai dengan desain Anda',
  'Memaksakan diri untuk menjadi seperti orang lain',
  'Mengabaikan intuisi dan sinyal tubuh Anda',
  'Membuat keputusan berdasarkan logika semata',
];

const reportBenefits = [
  {
    title: 'Analisis Mendalam 40+ Halaman',
    description: 'Laporan komprehensif tentang tipe, profil, otoritas, dan strategi Anda',
  },
  {
    title: 'Panduan Karir & Hubungan',
    description: 'Rekomendasi spesifik untuk sukses dalam karir dan relasi',
  },
  {
    title: 'Peta Potensi Tersembunyi',
    description: 'Temukan bakat dan kemampuan yang mungkin belum Anda sadari',
  },
  {
    title: 'Panduan Pengambilan Keputusan',
    description: 'Cara membuat keputusan yang selaras dengan desain sejati Anda',
  },
  {
    title: 'Analisis 9 Energy Center',
    description: 'Pemahaman mendalam tentang bagaimana energi mengalir dalam diri Anda',
  },
  {
    title: 'Tips Kesehatan & Vitalitas',
    description: 'Rekomendasi gaya hidup berdasarkan desain unik Anda',
  },
];

const testimonials = [
  {
    name: 'Sarah W.',
    type: 'Generator',
    quote: 'Full Report ini benar-benar membuka mata saya. Akhirnya saya paham kenapa saya selalu merasa tidak cocok dengan pekerjaan kantoran!',
  },
  {
    name: 'Budi P.',
    type: 'Projector',
    quote: 'Sebagai Projector, saya belajar bahwa menunggu undangan adalah kunci sukses saya. Laporan ini mengubah cara saya berbisnis.',
  },
];

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block text-accent text-sm font-semibold mb-4 uppercase tracking-wider">
              Full Personalized Report
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Temukan <span className="text-gradient-fire">Cetak Biru</span> Kehidupan Anda
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Laporan Human Design personal yang mendalam untuk membantu Anda hidup sesuai dengan desain sejati Anda.
            </p>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="px-4 py-12 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Apakah Anda Mengalami Ini?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {painPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 glass-card p-4 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-destructive" />
                  </div>
                  <p className="text-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wrong Solutions Section */}
        <section className="px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
              Solusi yang Tidak Bekerja
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Banyak orang mencoba berbagai cara untuk menemukan diri, tapi tanpa pemahaman tentang desain unik mereka:
            </p>
            <div className="space-y-3 max-w-xl mx-auto">
              {wrongSolutions.map((solution, index) => (
                <div key={index} className="flex items-center gap-3 text-muted-foreground">
                  <X className="w-5 h-5 text-destructive/60 shrink-0" />
                  <span>{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="px-4 py-16 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">Solusi yang Tepat</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Human Design: Peta Perjalanan Hidup Anda
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Human Design menggabungkan astrologi, I-Ching, Kabbalah, dan sistem Chakra untuk memberikan pemahaman yang unik tentang siapa Anda sebenarnya.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {reportBenefits.map((benefit, index) => (
              <div key={index} className="glass-card p-6 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              Apa Kata Mereka?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="glass-card p-6 rounded-xl">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-accent font-semibold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16">
          <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 md:p-12 text-center">
            <FileText className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Dapatkan Full Report Anda
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Laporan 40+ halaman yang dipersonalisasi berdasarkan data kelahiran Anda. Pahami diri Anda lebih dalam dan hidup sesuai desain sejati Anda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-accent" />
                Jaminan uang kembali 30 hari
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-accent" />
                Dikirim dalam 24 jam
              </div>
            </div>

            <Button 
              size="lg" 
              className="fire-glow text-lg px-8 py-6" 
              asChild
            >
              <Link to="/">
                Buat Chart Gratis Dulu
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              *Untuk membeli Full Report, Anda perlu membuat chart gratis terlebih dahulu
            </p>
          </div>
        </section>

        {/* Shop Link */}
        <section className="px-4 py-8 text-center">
          <Link to="/shop" className="text-accent hover:underline inline-flex items-center gap-2">
            Lihat semua produk digital kami
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
