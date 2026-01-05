import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Sparkles, BookOpen, Compass, Heart, Star } from 'lucide-react';

const methodologySources = [
  {
    title: 'Astrologi',
    description: 'Posisi planet saat kelahiran Anda memberikan dasar untuk gate dan channel dalam chart.',
    icon: Star,
  },
  {
    title: 'I-Ching',
    description: '64 hexagram dari I-Ching China kuno memetakan 64 gate dalam Human Design.',
    icon: BookOpen,
  },
  {
    title: 'Kabbalah',
    description: 'Tree of Life memberikan struktur untuk 9 energy center dalam bodygraph.',
    icon: Sparkles,
  },
  {
    title: 'Sistem Chakra Hindu',
    description: 'Tradisi chakra Hindu menginspirasi konsep pusat-pusat energi dalam tubuh.',
    icon: Heart,
  },
  {
    title: 'Fisika Kuantum',
    description: 'Konsep modern tentang neutrino dan partikel subatomik yang membawa informasi.',
    icon: Compass,
  },
];

const Methodology = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Metodologi <span className="text-gradient-fire">Human Design</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Memahami fondasi ilmiah dan spiritual di balik sistem Human Design.
            </p>
          </div>

          {/* Introduction */}
          <section className="glass-card rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Apa itu Human Design?
            </h2>
            <p className="text-muted-foreground mb-4">
              Human Design adalah sistem yang diterima oleh Ra Uru Hu pada tahun 1987 melalui pengalaman mistis selama 8 hari. Sistem ini menggabungkan kebijaksanaan kuno dengan sains modern untuk menciptakan peta unik tentang bagaimana Anda dirancang untuk beroperasi di dunia.
            </p>
            <p className="text-muted-foreground">
              Berbeda dengan sistem kepribadian lainnya, Human Design tidak hanya menggambarkan siapa Anda, tetapi juga memberikan strategi praktis untuk membuat keputusan yang selaras dengan sifat sejati Anda.
            </p>
          </section>

          {/* Sources */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              5 Sumber Kebijaksanaan
            </h2>
            <div className="space-y-6">
              {methodologySources.map((source, index) => {
                const Icon = source.icon;
                return (
                  <div key={index} className="glass-card rounded-xl p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {source.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {source.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How We Calculate */}
          <section className="glass-card rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Bagaimana Chart Dihitung?
            </h2>
            <p className="text-muted-foreground mb-4">
              Chart Human Design Anda dihitung berdasarkan data kelahiran yang tepat: tanggal, waktu, dan lokasi. Posisi matahari, bulan, dan planet lainnya pada saat kelahiran Anda menentukan aktivasi gate dalam bodygraph Anda.
            </p>
            <p className="text-muted-foreground mb-4">
              Uniknya, Human Design juga memperhitungkan posisi planet 88 hari sebelum kelahiran Anda (Design Calculation) yang mewakili aspek bawah sadar Anda, sementara posisi saat kelahiran (Personality Calculation) mewakili aspek sadar Anda.
            </p>
            <p className="text-muted-foreground">
              Kombinasi kedua kalkulasi ini menciptakan bodygraph yang unik untuk setiap individu, menunjukkan bagaimana energi mengalir dalam diri Anda dan bagaimana Anda berinteraksi dengan dunia.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="text-center text-sm text-muted-foreground">
            <p>
              Human Design adalah alat untuk eksplorasi diri dan tidak dimaksudkan untuk menggantikan nasihat medis, psikologis, atau profesional lainnya.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Methodology;
