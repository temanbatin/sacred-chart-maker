import { useRef, useState } from 'react';
import { FloatingParticles } from '@/components/FloatingParticles';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { CalculatorForm, BirthData } from '@/components/CalculatorForm';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { ChartResult } from '@/components/ChartResult';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FAQSection } from '@/components/FAQSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Index = () => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [userName, setUserName] = useState('');

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (data: BirthData) => {
    setIsLoading(true);
    setUserName(data.name);

    try {
      const { data: result, error } = await supabase.functions.invoke('calculate-chart', {
        body: {
          year: data.year,
          month: data.month,
          day: data.day,
          hour: data.hour,
          minute: data.minute,
          place: data.place,
          gender: data.gender,
        },
      });

      if (error) {
        console.error('Error calculating chart:', error);
        toast.error('Terjadi kesalahan saat menghitung chart. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      setChartData(result);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setChartData(null);
    setUserName('');
    scrollToCalculator();
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Floating particles background */}
      <FloatingParticles />

      {/* Loading overlay */}
      {isLoading && <LoadingAnimation />}

      {/* Main content */}
      <main className="relative z-10">
        {!chartData ? (
          <>
            <HeroSection onScrollToCalculator={scrollToCalculator} />
            <HowItWorksSection />
            <CalculatorForm
              ref={calculatorRef}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <TestimonialsSection />
            <FAQSection />
            <NewsletterSection />
          </>
        ) : (
          <ChartResult
            data={chartData}
            userName={userName}
            onReset={handleReset}
          />
        )}
        <Footer />
      </main>
    </div>
  );
};

export default Index;
