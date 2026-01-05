import { useRef, useState, useEffect } from 'react';
import { FloatingParticles } from '@/components/FloatingParticles';
import { MainNavbar } from '@/components/MainNavbar';
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
import { User, Session } from '@supabase/supabase-js';

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
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [birthData, setBirthData] = useState<BirthDataForChart | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [pendingBirthData, setPendingBirthData] = useState<BirthData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (data: BirthData) => {
    // If user is already logged in, skip lead capture
    if (user) {
      await processChartGeneration(data, user.email || '', '', null);
    } else {
      // Show lead capture modal for signup
      setPendingBirthData(data);
      setShowLeadCapture(true);
    }
  };

  const processChartGeneration = async (
    birthDataInput: BirthData, 
    email: string, 
    whatsapp: string, 
    password: string | null
  ) => {
    setIsLoading(true);
    setUserName(birthDataInput.name);
    setUserEmail(email);
    setUserPhone(whatsapp);

    // Store birth data for bodygraph
    setBirthData({
      year: birthDataInput.year,
      month: birthDataInput.month,
      day: birthDataInput.day,
      hour: birthDataInput.hour,
      minute: birthDataInput.minute,
      place: birthDataInput.place,
    });

    // Create birth date string for database
    const birthDateStr = `${birthDataInput.year}-${String(birthDataInput.month).padStart(2, '0')}-${String(birthDataInput.day).padStart(2, '0')}`;
    const birthTimeStr = `${String(birthDataInput.hour).padStart(2, '0')}:${String(birthDataInput.minute).padStart(2, '0')}:00`;

    try {
      let currentUser = user;

      // If password provided, create account first
      if (password && !user) {
        const redirectUrl = `${window.location.origin}/`;
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: birthDataInput.name,
              whatsapp: whatsapp,
            },
          },
        });

        if (authError) {
          if (authError.message.includes('User already registered')) {
            toast.error('Email sudah terdaftar. Silakan login di halaman Akun.');
            setIsLoading(false);
            return;
          }
          console.error('Auth error:', authError);
          toast.error('Gagal membuat akun: ' + authError.message);
          setIsLoading(false);
          return;
        }

        currentUser = authData.user;
        toast.success('Akun berhasil dibuat!');
      }

      // Only save lead for new signups (not for existing logged-in users)
      if (password && whatsapp) {
        const { error: leadError } = await supabase.functions.invoke('submit-lead', {
          body: {
            name: birthDataInput.name,
            email: email,
            whatsapp: whatsapp,
            birth_date: birthDateStr,
            birth_place: birthDataInput.place,
          },
        });

        if (leadError) {
          console.error('Error saving lead:', leadError);
          if (leadError.message?.includes('429') || leadError.message?.includes('Terlalu banyak')) {
            toast.error('Terlalu banyak permintaan. Silakan coba lagi nanti.');
            setIsLoading(false);
            return;
          }
        }
      }

      // Calculate chart
      const { data: result, error } = await supabase.functions.invoke('calculate-chart', {
        body: {
          year: birthDataInput.year,
          month: birthDataInput.month,
          day: birthDataInput.day,
          hour: birthDataInput.hour,
          minute: birthDataInput.minute,
          place: birthDataInput.place,
          gender: birthDataInput.gender,
        },
      });

      if (error) {
        console.error('Error calculating chart:', error);
        toast.error('Terjadi kesalahan saat menghitung chart. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      // Save chart to database if user is logged in
      if (currentUser) {
        const { error: saveError } = await supabase
          .from('saved_charts')
          .insert({
            user_id: currentUser.id,
            name: birthDataInput.name,
            birth_date: birthDateStr,
            birth_time: birthTimeStr,
            birth_place: birthDataInput.place,
            chart_data: result,
          });

        if (saveError) {
          console.error('Error saving chart:', saveError);
          // Don't block the flow, chart is still displayed
        } else {
          toast.success('Chart berhasil disimpan ke akun Anda!');
        }
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

  const handleLeadSubmit = async (leadData: { whatsapp: string; email: string; password: string }) => {
    if (!pendingBirthData) return;
    setShowLeadCapture(false);
    await processChartGeneration(pendingBirthData, leadData.email, leadData.whatsapp, leadData.password);
  };

  const handleReset = () => {
    setChartData(null);
    setUserName('');
    setUserEmail('');
    setUserPhone('');
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
      {/* Navbar */}
      <MainNavbar />
      
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
            <div id="calculator">
              <CalculatorForm
                ref={calculatorRef}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
            <TestimonialsSection />
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
            onReset={handleReset}
          />
        )}
        <Footer />
      </main>
    </div>
  );
};

export default Index;
