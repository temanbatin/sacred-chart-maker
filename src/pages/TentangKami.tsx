import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Heart, Sparkles, Users, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-background">
      <MainNavbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">
            Tentang <span className="text-accent">Teman Batin</span>
          </h1>
          
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Membantu Anda menemukan dan memahami desain sejati diri melalui ilmu Human Design.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
              <Heart className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Misi Kami</h3>
              <p className="text-muted-foreground">
                Membuat ilmu Human Design dapat diakses oleh semua orang Indonesia, 
                membantu setiap individu memahami potensi unik dan tujuan hidup mereka.
              </p>
            </div>

            <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
              <Target className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Visi Kami</h3>
              <p className="text-muted-foreground">
                Menjadi platform terpercaya untuk eksplorasi diri dan pengembangan 
                pribadi berbasis Human Design di Indonesia.
              </p>
            </div>

            <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
              <Sparkles className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Apa itu Human Design?</h3>
              <p className="text-muted-foreground">
                Human Design adalah sistem yang menggabungkan astrologi, I Ching, Kabbalah, 
                dan sistem Chakra untuk mengungkap blueprint energi unik Anda.
              </p>
            </div>

            <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
              <Users className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Tim Kami</h3>
              <p className="text-muted-foreground">
                Didukung oleh praktisi Human Design bersertifikat dan pengembang teknologi 
                yang passionate dalam membantu transformasi diri.
              </p>
            </div>
          </div>

          <div className="bg-accent/10 rounded-2xl p-8 border border-accent/20 text-center">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Mulai Perjalanan Anda
            </h3>
            <p className="text-muted-foreground mb-6">
              Temukan chart Human Design Anda secara gratis dan mulai pahami siapa diri Anda sebenarnya.
            </p>
            <button 
              onClick={handleGetChart}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full font-semibold hover:bg-accent/90 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Hitung Chart Gratis
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TentangKami;
