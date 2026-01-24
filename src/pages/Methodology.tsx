import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Sparkles, BookOpen, Compass, Heart, Star, Server, ShieldCheck, Zap, Database } from 'lucide-react';
import methodologyHero from '@/assets/methodology-hero.png';
import aboutHero from '@/assets/about-hero.png';

const methodologySources = [
  {
    title: 'Astrologi',
    description: 'Data posisi planet presisi dari NASA JPL (Jet Propulsion Laboratory) ephemeris.',
    icon: Star,
  },
  {
    title: 'I-Ching',
    description: '64 hexagram dari I-Ching China kuno memetakan 64 gate DNA dalam Human Design.',
    icon: BookOpen,
  },
  {
    title: 'Kabbalah',
    description: 'Tree of Life memberikan struktur aliran energi untuk 9 energy center.',
    icon: Sparkles,
  },
  {
    title: 'Sistem Chakra',
    description: 'Evolusi dari 7 chakra kuno menjadi 9 center manusia modern.',
    icon: Heart,
  },
  {
    title: 'Fisika Kuantum',
    description: 'Perhitungan aliran neutrino yang membawa informasi massal ke dalam tubuh.',
    icon: Compass,
  },
];

const Methodology = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainNavbar />

      <main className="pt-24 pb-0">
        {/* Hero Section */}
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={methodologyHero}
            alt="Teman Batin Methodology Engine"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center max-w-4xl mx-auto space-y-6 animate-fade-up">
              <span className="px-6 py-2 rounded-full bg-black/60 text-emerald-400 border border-emerald-500/30 text-sm font-semibold tracking-widest backdrop-blur-md shadow-xl">
                CORE ENGINE
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Presisi Di Balik <br />
                <span className="text-accent">Keajaiban</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Kami tidak meminjam "otak" orang lain. Kami membangunnya sendiri.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 space-y-24">

          {/* The Sovereign Engine Difference */}
          <section className="bg-secondary/20 border border-border rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-accent font-semibold tracking-wide uppercase text-sm">
                  <Server className="w-5 h-5" />
                  Proprietary Technology
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Satu-satunya di Indonesia:<br />
                  <span className="text-foreground">Self-Hosted Chart Engine</span>
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg">
                  <p>
                    Tahukah kamu? Mayoritas praktisi dan website Human Design di luar sana hanya "menempel" (embed) widget kalkulator dari layanan pihak ketiga (biasanya dari AS atau Eropa).
                  </p>
                  <p>
                    <strong>Teman Batin berbeda.</strong> Kami membangun <em>Calculation Engine</em> kami sendiri dari nol di server kami.
                  </p>
                  <p>
                    Ini bukan sekadar kebanggaan teknis, tapi jaminan kedaulatan data dan akurasi untuk kamu.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="bg-background/50 p-6 rounded-xl border border-border hover:border-accent/50 transition-colors flex gap-4">
                  <ShieldCheck className="w-10 h-10 text-emerald-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-1">Privasi Mutlak</h3>
                    <p className="text-sm text-muted-foreground">
                      Data kelahiran kamu diproses di server kami sendiri, tidak dikirim ke pihak ketiga asing/aggregator data.
                    </p>
                  </div>
                </div>
                <div className="bg-background/50 p-6 rounded-xl border border-border hover:border-accent/50 transition-colors flex gap-4">
                  <Zap className="w-10 h-10 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-1">Kecepatan Kilat</h3>
                    <p className="text-sm text-muted-foreground">
                      Tanpa request eksternal yang lambat. Chart Kamu dihitung dalam milidetik di infrastruktur lokal.
                    </p>
                  </div>
                </div>
                <div className="bg-background/50 p-6 rounded-xl border border-border hover:border-accent/50 transition-colors flex gap-4">
                  <Database className="w-10 h-10 text-blue-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-1">Akurasi Swiss Ephemeris</h3>
                    <p className="text-sm text-muted-foreground">
                      Menggunakan standar astronomi Swiss Ephemeris yang sama dengan NASA untuk perhitungan posisi planet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sources Grid */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-12">
              Perpaduan 5 Ilmu Kuno & Modern
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {methodologySources.map((source, index) => {
                const Icon = source.icon;
                return (
                  <div key={index} className="glass-card rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:bg-secondary/40 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {source.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {source.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Calculation Process */}
          <section className="glass-card rounded-3xl p-8 md:p-12 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Bagaimana Chart Kamu Dihitung?
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-accent flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm border border-accent/30">1</span>
                  Personality (Kesadaran)
                </h3>
                <p className="text-muted-foreground">
                  Dihitung tepat pada saat kelahiran kamu (Jam/Menit/Lokasi). Ini adalah "siapa yang kamu pikir kamu adalah"—aspek diri yang kamu sadari dan akses secara mental.
                </p>
                <div className="h-px bg-border my-4" />
                <h3 className="text-xl font-semibold text-destructive flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-sm border border-destructive/30">2</span>
                  Design (Bawah Sadar)
                </h3>
                <p className="text-muted-foreground">
                  Dihitung mundur 88 derajat matahari (sekitar 3 bulan) sebelum kelahiran. Ini adalah warisan genetik dan tubuh fisik kamu—intelijensi tubuh yang seringkali bekerja tanpa kamu sadari.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl h-64 md:h-full min-h-[300px] border border-border group">
                <img
                  src={aboutHero}
                  alt="Quantum Juxtaposition"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white/90 font-medium italic">
                    "Quantum Juxtaposition (Penyatuan Kuantum) dari kedua kalkulasi inilah yang membentuk Bodygraph Human Design kamu yang unik."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Report Creation Process (The Synthesis) */}
          <section className="mt-24 mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Di Balik Layar: <span className="text-accent">Dapur Analisis Kami</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Banyak yang bertanya, "Bagaimana kalkulator gratis bisa menghasilkan analisis sedalam ini?" Jawabannya ada pada proses sintesa kami.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-card border border-border/50 p-8 rounded-2xl relative">
                <div className="absolute -top-6 left-8 bg-secondary border border-border p-3 rounded-xl shadow-lg">
                  <Database className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mt-8 mb-4">1. Ekstraksi Raw Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mesin kami tidak sekadar melihat "kamu Tipe Generator". Ia membedah hingga ke layer terdalam: 26 aktivasi planet, 64 gate, hingga tone & base di level sub-atomik. Ini adalah bahan mentahnya.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-card border border-border/50 p-8 rounded-2xl relative">
                <div className="absolute -top-6 left-8 bg-secondary border border-border p-3 rounded-xl shadow-lg">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mt-8 mb-4">2. The Quantum Weaving</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Disinilah bedanya. Algoritma kami dilatih untuk melihat <strong>hubungan</strong> antar data. Bagaimana Gate A di Matahari mempengaruhi Gate B di Bulan? Kami tidak menyajikan data terpotong, tapi sebuah benang merah.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-card border border-border/50 p-8 rounded-2xl relative">
                <div className="absolute -top-6 left-8 bg-secondary border border-border p-3 rounded-xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mt-8 mb-4">3. Terjemahan "Bahasa Manusia"</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Data rumit tadi diterjemahkan ke dalam bahasa Indonesia yang mengalir, empatik, dan <em>grounded</em>. Bukan bahasa textbook kaku, tapi sapaan seorang mentor yang mengerti perjalanan kamu.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="text-center text-sm text-muted-foreground max-w-2xl mx-auto border-t border-border pt-8">
            <p>
              Kami menggunakan data waktu Universal (UTC) yang dikonversi secara presisi dari waktu lokal kelahiran kamu, mempertimbangkan zona waktu historis dan Daylight Saving Time (DST) yang berlaku pada tahun tersebut.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Methodology;
