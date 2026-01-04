import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
interface HeroSectionProps {
  onScrollToCalculator: () => void;
}
export const HeroSection = ({
  onScrollToCalculator
}: HeroSectionProps) => {
  return <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center animate-fade-up">
        {/* Decorative element */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Sparkles className="w-12 h-12 text-accent animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-accent/30 rounded-full" />
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl font-bold mb-6 text-gradient-fire leading-tight md:text-5xl my-0">Satu-satunya Peta yang Kamu Butuhkan Untuk Menjadi Dirimu Sendiri</h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
          Dunia selalu menyuruhmu menjadi orang lain. Kami membantumu pulang ke desain sejatimu, mengenali bakat bawaan, dan memahami mengapa kamu diciptakan berbeda.
        </p>

        

        {/* CTA Button */}
        <Button onClick={onScrollToCalculator} size="lg" className="fire-glow bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 rounded-full font-semibold">
          Buat Chart Human Design Gratis
        </Button>

        {/* Trust indicator */}
        <p className="mt-8 text-sm text-muted-foreground/60">
          Bergabunglah dengan 1500+ pencari jati diri lainnya hari ini.
        </p>
      </div>
    </section>;
};