import { Button } from '@/components/ui/button';
import { Sparkles, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onScrollToCalculator: () => void;
  userName?: string | null;
}

export const HeroSection = ({
  onScrollToCalculator,
  userName
}: HeroSectionProps) => {
  return <section className="relative pt-32 pb-16 px-4">
    <div className="max-w-4xl mx-auto text-center animate-fade-up">
      {/* Decorative element */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Sparkles className="w-12 h-12 text-accent animate-pulse" />
          <div className="absolute inset-0 blur-xl bg-accent/30 rounded-full" />
        </div>
      </div>

      {userName ? (
        <>
          <h1 className="text-5xl font-bold mb-6 text-gradient-fire leading-tight md:text-5xl my-0">
            Selamat Datang Kembali, {userName}!
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Lanjutkan perjalananmu mengenali diri sejati dan potensi terbaikmu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="fire-glow bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full font-semibold">
              <Link to="/account">
                Lihat Chart Saya
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button onClick={onScrollToCalculator} variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
              Buat Chart Baru
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-fire leading-tight my-0">
            Lelah Merasa Ada yang Salah dengan Dirimu?
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
            Analisis kami akan menjelaskan KENAPA dan memberikan jalan keluar — dalam hitungan detik.
          </p>
          <Button onClick={onScrollToCalculator} size="lg" className="fire-glow bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 rounded-full font-semibold">
            Temukan Jawabannya (Gratis)
          </Button>
        </>
      )}

      {/* Trust indicator */}
      <p className="mt-8 text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
        <Star className="w-4 h-4 fill-accent text-accent" />
        Bergabunglah dengan 230 orang yang sudah membaca desain tubuh, jiwa dan pikiran mereka.
      </p>
    </div>
  </section>;
};