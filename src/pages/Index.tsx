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
import { LeadCaptureModal } from '@/components/LeadCaptureModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BirthDataForChart {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  place: string;
}

const Index = () => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [birthData, setBirthData] = useState<BirthDataForChart | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [pendingBirthData, setPendingBirthData] = useState<BirthData | null>(null);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (data: BirthData) => {
    // Show lead capture modal first
    setPendingBirthData(data);
    setShowLeadCapture(true);
  };

  const handleLeadSubmit = async (leadData: { whatsapp: string; email: string }) => {
    if (!pendingBirthData) return;

    setShowLeadCapture(false);
    setIsLoading(true);
    setUserName(pendingBirthData.name);

    // Store birth data for bodygraph
    setBirthData({
      year: pendingBirthData.year,
      month: pendingBirthData.month,
      day: pendingBirthData.day,
      hour: pendingBirthData.hour,
      minute: pendingBirthData.minute,
      place: pendingBirthData.place,
    });

    try {
      const { data: result, error } = await supabase.functions.invoke('calculate-chart', {
        body: {
          year: pendingBirthData.year,
          month: pendingBirthData.month,
          day: pendingBirthData.day,
          hour: pendingBirthData.hour,
          minute: pendingBirthData.minute,
          place: pendingBirthData.place,
          gender: pendingBirthData.gender,
          // Include lead data for potential future use
          leadWhatsapp: leadData.whatsapp,
          leadEmail: leadData.email,
        },
      });

      if (error) {
        console.error('Error calculating chart:', error);
        toast.error('Terjadi kesalahan saat menghitung chart. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      setChartData(result);
      setPendingBirthData(null);
      // Scroll to top when chart is ready
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setBirthData(null);
    setPendingBirthData(null);
    scrollToCalculator();
  };

  const handleLeadCaptureClose = () => {
    setShowLeadCapture(false);
    setPendingBirthData(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Floating particles background */}
      <FloatingParticles />

      {/* Loading overlay */}
      {isLoading && <LoadingAnimation />}

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={handleLeadCaptureClose}
        onSubmit={handleLeadSubmit}
        isLoading={isLoading}
      />

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
            birthData={birthData}
            onReset={handleReset}
          />
        )}
        <Footer />
      </main>
    </div>
  );
};

export default Index;
