import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FloatingParticles } from '@/components/FloatingParticles';
import { MainNavbar } from '@/components/MainNavbar';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { MultiStepForm, BirthData } from '@/components/MultiStepForm';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { ChartResult } from '@/components/ChartResult';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FAQSection } from '@/components/FAQSection';
import { ReportPreviewSection } from '@/components/ReportPreviewSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Footer } from '@/components/Footer';
import { LeadCaptureModal } from '@/components/LeadCaptureModal';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { ScrollToTop } from '@/components/ScrollToTop';

import { useAuthSession } from '@/hooks/useAuthSession';
import { useChartGenerator } from '@/hooks/useChartGenerator';

const Index = () => {
  const calculatorRef = useRef<HTMLDivElement>(null);

  // Custom Hooks
  const { user, loading: authLoading } = useAuthSession();

  const {
    isLoading: isChartLoading,
    chartData,
    userName,
    userEmail,
    userPhone,
    birthData,
    showLeadCapture,
    currentChartId,
    generateChart,
    submitLead,
    resetChart,
    closeLeadCapture,
  } = useChartGenerator(user);

  // Derived state
  const isLoading = authLoading || isChartLoading;

  // Scroll handler
  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handlers
  const handleSubmit = async (data: BirthData) => {
    // Generate chart directly - no registration required
    // User can save chart later by logging in
    const email = user?.email || '';
    await generateChart(data, email, '', null);
  };

  const handleReset = () => {
    resetChart();
    scrollToCalculator();
  };

  // URL Params Logic for Shared Links
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Scroll to top on initial page load
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Handle 'Show Chart' button from homepage or external link
    const action = searchParams.get('action');
    if (action === 'generate' && !chartData && !isChartLoading) {
      const name = searchParams.get('n');
      const date = searchParams.get('d');
      const time = searchParams.get('t');
      const place = searchParams.get('p');
      const gender = searchParams.get('g');

      if (name && date && time && place && gender) {
        const [day, month, year] = date.split('-').map(Number); // date format d-m-y
        const [hour, minute] = time.split(':').map(Number);

        const birthDataParam: BirthData = {
          name,
          day: day || 1,
          month: month || 1,
          year: year || 2000,
          hour: hour || 0,
          minute: minute || 0,
          place,
          gender: gender as 'male' | 'female',
        };

        // Add small delay to ensure hydration
        setTimeout(() => {
          generateChart(birthDataParam, '', '', '');
        }, 500);
      }
    }
  }, [searchParams, chartData, isChartLoading, generateChart]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Navbar */}
      <MainNavbar />

      {/* Floating particles background */}
      <FloatingParticles />

      {/* Loading overlay */}
      {isLoading && <LoadingAnimation />}

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={closeLeadCapture}
        onSubmit={submitLead}
        isLoading={isLoading}
      />

      {/* Main content */}
      <main className="relative z-10">
        {!chartData ? (
          <>
            <HeroSection
              onScrollToCalculator={scrollToCalculator}
              userName={user?.user_metadata?.name}
            />
            <HowItWorksSection />
            <div id="calculator">
              <MultiStepForm
                ref={calculatorRef}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
            <TestimonialsSection />
            <ReportPreviewSection />
            <FAQSection />
            <NewsletterSection />
          </>
        ) : (
          <ChartResult
            data={chartData}
            userName={userName}
            userEmail={userEmail}
            userPhone={userPhone}
            birthData={birthData}
            chartId={currentChartId}
            userId={user?.id}
            onReset={handleReset}
          />
        )}
        <Footer />
        <ExitIntentPopup />
        <ScrollToTop />
      </main>
    </div>
  );
};

export default Index;
