import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onScrollToCalculator: () => void;
}

export const HeroSection = ({ onScrollToCalculator }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center animate-fade-up">
        {/* Decorative element */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Sparkles className="w-12 h-12 text-accent animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-accent/30 rounded-full" />
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-fire leading-tight">
          Temukan Desain Sejatimu
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
          Ungkap cetak biru energi unikmu yang tertulis di bintang-bintang sejak kamu lahir
        </p>

        <p className="text-lg text-muted-foreground/80 mb-12 max-w-xl mx-auto">
          Human Design menggabungkan astrologi, I'Ching, Kabbalah, dan sistem chakra untuk 
          mengungkap siapa dirimu yang sebenarnya
        </p>

        {/* CTA Button */}
        <Button
          onClick={onScrollToCalculator}
          size="lg"
          className="fire-glow bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 rounded-full font-semibold"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Mulai Perhitungan Gratis
        </Button>

        {/* Trust indicator */}
        <p className="mt-8 text-sm text-muted-foreground/60">
          ✨ Sudah dipercaya lebih dari 10.000+ pencari jati diri
        </p>
      </div>
    </section>
  );
};
