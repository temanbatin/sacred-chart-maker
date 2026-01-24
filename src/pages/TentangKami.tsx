import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Map, Leaf, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import aboutHero from '@/assets/about-hero.png';

const TentangKami = () => {
  const navigate = useNavigate();

  const handleGetChart = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('calculator');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainNavbar />

      <main className="pt-24 pb-0">
        {/* Banner Section */}
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={aboutHero}
            alt="Tentang Teman Batin"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center max-w-4xl mx-auto space-y-6 animate-fade-up">
              <span className="px-6 py-2 rounded-full bg-black/60 text-white border border-white/20 text-sm font-semibold tracking-widest backdrop-blur-md shadow-xl">
                OUR STORY
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Lebih Dari Sekadar Algoritma.<br />
                <span className="text-accent">Ini Jalan Pulang.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Lahir dari 15 tahun pencarian jati diri, Teman Batin hadir agar kamu tidak perlu tersesat sendirian.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 space-y-24">

          {/* The Origin Story */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Bermula dari Kelelahan</h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Dunia sering memberitahu kita siapa kita seharusnya. "Kerja keras," "fokus pada hasil," "jangan menyerah." Kita berlari mengejar ekspektasi, namun seringkali merasa kosong di garis finis.
                </p>
                <p>
                  Itulah yang dialami Founder kami, Nusa Ardi, selama 15 tahun. Sebuah siklus <em>trial & error</em> yang melelahkan. Memaksakan diri menjadi "mesin produktivitas" padahal desain alaminya membutuhkan kebebasan berkreasi.
                </p>
                <p>
                  Sampai akhirnya ia menemukan <strong className="text-foreground">Human Design</strong>. Sebuah peta yang bukan sekadar label kepribadian, tapi manual instruksi untuk jiwa.
                </p>
              </div>
            </div>
            <div className="bg-secondary/20 p-8 rounded-2xl border border-border relative overflow-hidden group">
              {/* Decorative Elements */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-700" />
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Map className="w-5 h-5 text-accent" />
                  Mengapa Kami Ada?
                </h3>
                <p className="text-muted-foreground italic mb-6">
                  "Saya membangun Teman Batin agar kamu tidak perlu membuang waktu 15 tahun tersesat seperti saya."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">
                    N
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Nusa Ardi</p>
                    <p className="text-xs text-muted-foreground">Founder Teman Batin</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* The Difference Section */}
          <section className="text-center space-y-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Human Design dengan "Rasa" Indonesia</h2>
              <p className="text-muted-foreground text-lg">
                Kebanyakan generator di luar sana menggunakan bahasa teknis yang kaku dan asing. Kami berbeda.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card hover:bg-secondary/40 transition-colors p-8 rounded-2xl border border-border shadow-sm group">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Personal & Membumi</h3>
                <p className="text-sm text-muted-foreground">
                  Kami menerjemahkan konsep rumit menjadi bahasa yang menyentuh hati dan relevan dengan budaya kita sehari-hari.
                </p>
              </div>
              <div className="bg-card hover:bg-secondary/40 transition-colors p-8 rounded-2xl border border-border shadow-sm group">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Leaf className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Tumbuh Secara Alami</h3>
                <p className="text-sm text-muted-foreground">
                  Kami percaya setiap orang punya ritme unik. Tidak ada paksaan untuk menjadi "sukses" versi orang lain.
                </p>
              </div>
              <div className="bg-card hover:bg-secondary/40 transition-colors p-8 rounded-2xl border border-border shadow-sm group">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sains & Seni</h3>
                <p className="text-sm text-muted-foreground">
                  Kami menggabungkan perhitungan astronomi NASA yang dingin dengan seni interpretasi manusia yang hangat. Data akurat, penyampaian yang menyentuh.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-secondary/50 via-background to-accent/10 rounded-3xl p-8 md:p-12 text-center border border-accent/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">Siap Bertemu Diri Kamu yang Sebenarnya?</h2>
              <p className="text-lg text-muted-foreground">
                Jangan habiskan waktu mencoba menjadi orang lain. Unduh peta jiwa kamu sekarang, gratis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-lg h-12 rounded-full shadow-lg shadow-accent/20"
                  onClick={handleGetChart}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Cek Chart Saya
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg h-12 rounded-full"
                  onClick={() => navigate('/authors-note')}
                >
                  Baca Cerita Founder
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TentangKami;
