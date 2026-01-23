import { useState, useEffect, useRef } from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Check, X, ArrowRight, Star, Shield, Clock, FileText, Plus, Calendar, MapPin, Loader2, CreditCard, Mail, Phone, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { ChartGenerationModal } from '@/components/ChartGenerationModal';
import { BirthData } from '@/components/CalculatorForm';
import { LeadCaptureModal } from '@/components/LeadCaptureModal';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { ChartResult } from '@/components/ChartResult';
import { ReportPreviewSection } from '@/components/ReportPreviewSection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FAQSection } from '@/components/FAQSection';
import { ComparisonTable } from '@/components/ComparisonTable';
import { UnifiedCheckoutModal, UnifiedCheckoutData } from '@/components/UnifiedCheckoutModal';
import { TrustBadgeSection } from '@/components/TrustBadgeSection';

interface SavedChart {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string | null;
  birth_place: string | null;
  created_at: string;
}

// ... constants ...
const painPoints = [
  'Menghabiskan waktu dan energi meniru strategi sukses orang lain yang tidak cocok dengan energimu',
  'Merasa "salah" atau "berbeda" karena cara kamu berpikir/merasa tidak seperti mayoritas',
  'Konflik berulang dengan orang terkasih karena memaksakan cara kerjamu kepada mereka',
  'Sering merasa burnout atau lelah tanpa tahu penyebabnya, meski sudah berusaha keras',
  'Kesulitan membuat keputusan penting dengan percaya diri, takut salah pilih',
  'Mencari validasi bahwa kamu "normal" dan tidak rusak',
];

const wrongSolutions = [
  'Burnout karena ngikutin saran "Just Do It" terus-terusan',
  'Makin insecure karena maksa jadi seperti orang lain',
  'Ngerasa gagal karena "berbeda" dan terus nyalahin diri sendiri',
  'Keputusan yang salah karena cuma dengerin logika, abaikan intuisi',
  'Overwhelmed nyobain semua strategi productivity yang viral',
];

const reportBenefits = [
  {
    title: 'Analisis Mendalam 100+ Halaman',
    description: 'Laporan komprehensif tentang tipe, profil, otoritas, dan strategi Anda',
  },
  {
    title: 'Panduan Karir & Hubungan',
    description: 'Rekomendasi spesifik untuk sukses dalam karir dan relasi',
  },
  {
    title: 'Peta Potensi Tersembunyi',
    description: 'Temukan bakat dan kemampuan yang mungkin belum Anda sadari',
  },
  {
    title: 'Panduan Pengambilan Keputusan',
    description: 'Cara membuat keputusan yang selaras dengan desain sejati Anda',
  },
  {
    title: 'Analisis 9 Energy Center',
    description: 'Pemahaman mendalam tentang bagaimana energi mengalir dalam diri Anda',
  },
  {
    title: 'Tips Kesehatan & Vitalitas',
    description: 'Rekomendasi gaya hidup berdasarkan desain unik Anda',
  },
];

import { TestimonialsSection } from '@/components/TestimonialsSection';

import { PRICING_CONFIG, PRODUCTS, formatPrice } from '@/config/pricing';

const reportFeatures = [
  '100+ Halaman → Roadmap Lengkap Kehidupan Anda',
  'Tipe, Strategi & Otoritas → Cara Membuat Keputusan yang Tepat',
  'Analisis 9 Energy Center → Kelola Energi, Hindari Burnout',
  'Panduan Karir → Temukan Pekerjaan yang Flow dengan Energi Anda',
  'Peta Genius Zone → Maksimalkan Potensi Tersembunyi',
  'Tips Kesehatan → Vitalitas Optimal Sesuai Desain Anda',
  'Panduan Hubungan → Komunikasi yang Autentik & Harmonis',
];

const Reports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckoutPreview, setShowCheckoutPreview] = useState(false);
  const [showUnifiedCheckout, setShowUnifiedCheckout] = useState(false);
  const [showTncModal, setShowTncModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToTnc, setAgreedToTnc] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string | null; whatsapp: string | null } | null>(null);

  // Ref for final CTA section
  const finalCtaRef = useRef<HTMLElement>(null);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  // Billing info state
  const [billingName, setBillingName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingWhatsapp, setBillingWhatsapp] = useState('+62');
  const [useAccountData, setUseAccountData] = useState(false);

  // State for tracking ordered charts
  const [orderedChartIds, setOrderedChartIds] = useState<Set<string>>(new Set());
  const [pendingChartIds, setPendingChartIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(() => {
            fetchSavedCharts();
            fetchOrders();
          }, 0);
        } else {
          setIsLoading(false);
        }
      }
    );
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        fetchSavedCharts();
        fetchOrders();
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Scroll listener for Floating CTA
  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling 600px
      const isPastHero = window.scrollY > 600;

      // Hide if near the bottom (where the real CTA section is)
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const isNearBottom = docHeight - scrollBottom < 500; // Final CTA section is usually large

      setShowFloatingCTA(isPastHero && !isNearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchOrders = async () => {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('status, metadata')
      .in('status', ['PAID', 'PENDING']);

    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }

    const paidIds = new Set<string>();
    const pendingIds = new Set<string>();

    ordersData?.forEach((order: any) => {
      const chartIds = order.metadata?.chart_ids || [];
      if (Array.isArray(chartIds)) {
        chartIds.forEach((id: string) => {
          if (order.status === 'PAID') {
            paidIds.add(id);
          } else if (order.status === 'PENDING') {
            pendingIds.add(id);
          }
        });
      }
    });

    setOrderedChartIds(paidIds);
    setPendingChartIds(pendingIds);
  };

  const fetchSavedCharts = async () => {
    const { data, error } = await supabase
      .from('saved_charts')
      .select('id, name, birth_date, birth_time, birth_place, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching charts:', error);
    } else {
      setSavedCharts(data || []);
    }

    // Fetch user profile for phone number and name
    const { data: profileData } = await supabase
      .from('profiles')
      .select('name, whatsapp')
      .single();

    if (profileData) {
      setUserProfile(profileData as any);
    }

    setIsLoading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '-';
    const [hour, minute] = timeStr.split(':');
    return `${hour}:${minute}`;
  };

  const isChartOrdered = (id: string) => orderedChartIds.has(id);
  const isChartPending = (id: string) => pendingChartIds.has(id);

  const toggleChartSelection = (chartId: string) => {
    if (isChartOrdered(chartId) || isChartPending(chartId)) return;

    setSelectedCharts(prev =>
      prev.includes(chartId)
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };

  const selectAllCharts = () => {
    const availableCharts = savedCharts
      .map(c => c.id)
      .filter(id => !isChartOrdered(id) && !isChartPending(id));

    if (selectedCharts.length === availableCharts.length) {
      setSelectedCharts([]);
    } else {
      setSelectedCharts(availableCharts);
    }
  };

  const getTotalPrice = () => {
    return selectedCharts.length * PRODUCTS.FULL_REPORT.price;
  };

  const getOriginalTotalPrice = () => {
    return selectedCharts.length * PRODUCTS.FULL_REPORT.original_price;
  };

  const getSelectedChartDetails = () => {
    return savedCharts.filter(chart => selectedCharts.includes(chart.id));
  };

  const handleCheckoutClick = () => {
    if (selectedCharts.length === 0) {
      toast.error('Pilih minimal 1 chart untuk melanjutkan');
      return;
    }
    // Reset billing info
    setBillingName('');
    setBillingEmail('');
    setBillingWhatsapp('+62');
    setUseAccountData(false);
    setShowCheckoutPreview(true);
    setAgreedToTerms(false);
    setAgreedToTnc(false);
  };

  const handleUseAccountData = (checked: boolean) => {
    setUseAccountData(checked);
    if (checked && user) {
      setBillingEmail(user.email || '');
      setBillingName(userProfile?.name || '');
      setBillingWhatsapp(userProfile?.whatsapp || '+62');
    } else {
      setBillingName('');
      setBillingEmail('');
      setBillingWhatsapp('+62');
    }
  };

  const handleWhatsappChange = (value: string) => {
    // Ensure it always starts with +62
    if (!value.startsWith('+62')) {
      value = '+62' + value.replace(/^\+?62?/, '');
    }
    // Only allow numbers after +62
    const cleanValue = '+62' + value.slice(3).replace(/[^0-9]/g, '');
    setBillingWhatsapp(cleanValue);
  };

  const validateBillingInfo = () => {
    if (!billingName.trim()) {
      toast.error('Nama pemesan wajib diisi');
      return false;
    }
    if (!billingEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail)) {
      toast.error('Email tidak valid');
      return false;
    }
    if (!/^\+62[0-9]{9,12}$/.test(billingWhatsapp)) {
      toast.error('Nomor WhatsApp tidak valid (contoh: +628123456789)');
      return false;
    }
    return true;
  };

  const handleConfirmPayment = async () => {
    if (!validateBillingInfo()) {
      return;
    }

    if (!agreedToTerms || !agreedToTnc) {
      toast.error('Anda harus menyetujui semua ketentuan sebelum melanjutkan');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const selectedChartDetails = getSelectedChartDetails();
      const productNames = selectedChartDetails.map(c => `Full Report Human Design: ${c.name}`).join(', ');

      // Generate Reference ID uniquely
      const referenceId = `TB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // 1. Save order to database first
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null, // Handle guest or logged in
          reference_id: referenceId,
          customer_name: billingName,
          customer_email: billingEmail,
          customer_phone: billingWhatsapp,
          product_name: productNames,
          amount: getTotalPrice(),
          status: 'PENDING',
          metadata: { chart_ids: selectedCharts }
        });

      if (orderError) {
        console.error('Order creation error:', orderError);
        toast.error('Gagal membuat pesanan: ' + orderError.message);
        setIsProcessingPayment(false);
        return;
      }

      // 2. Call Payment Gateway
      const { data, error } = await supabase.functions.invoke('midtrans-checkout', {
        body: {
          referenceId: referenceId, // Pass the SAME ID
          customerName: billingName,
          customerEmail: billingEmail,
          customerPhone: billingWhatsapp,
          amount: getTotalPrice(),
          productName: productNames,
          chartIds: selectedCharts,
        },
      });

      if (error) {
        console.error('Payment function error:', error);
        toast.error('Gagal memproses pembayaran. Silakan coba lagi.');
        return;
      }

      if (data?.success && data?.paymentUrl) {

        // Optional: Update order with payment URL
        await supabase
          .from('orders')
          .update({ payment_url: data.paymentUrl })
          .eq('reference_id', referenceId);

        toast.success('Mengarahkan ke halaman pembayaran...');
        // Redirect to Payment Gateway
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data?.error || 'Gagal mendapatkan link pembayaran');
      }
    } catch (err) {
      console.error('Payment flow error:', err);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const [showChartModal, setShowChartModal] = useState(false);
  const [pendingBirthData, setPendingBirthData] = useState<BirthData | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [isGeneratingChart, setIsGeneratingChart] = useState(false);

  // New states for result view
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentChartData, setCurrentChartData] = useState<any>(null);
  const [currentBirthData, setCurrentBirthData] = useState<any>(null);
  const [currentChartId, setCurrentChartId] = useState<string | undefined>(undefined);

  const handleAddNewChart = () => {
    setShowChartModal(true);
  };

  const handleChartSubmit = async (data: BirthData) => {
    if (user) {
      await processChartGeneration(data, user.email || '', '', null);
    } else {
      setPendingBirthData(data);
      setShowLeadCapture(true);
      setShowChartModal(false);
    }
  };

  const processChartGeneration = async (
    birthDataInput: BirthData,
    email: string,
    whatsapp: string,
    password: string | null
  ) => {
    setIsGeneratingChart(true);
    const birthDateStr = `${birthDataInput.year}-${String(birthDataInput.month).padStart(2, '0')}-${String(birthDataInput.day).padStart(2, '0')}`;
    const birthTimeStr = `${String(birthDataInput.hour).padStart(2, '0')}:${String(birthDataInput.minute).padStart(2, '0')}:00`;

    try {
      let currentUser = user;

      // Handle Signup if needed
      if (password && !user) {
        // We don't necessarily need to redirect, just sign up and continue
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: birthDataInput.name, whatsapp: whatsapp },
          },
        });

        if (authError) {
          if (authError.message.includes('User already registered')) {
            toast.error('Email sudah terdaftar. Silakan login.');
          } else {
            toast.error('Gagal membuat akun: ' + authError.message);
          }
          setIsGeneratingChart(false);
          return;
        }

        // If auto-login happens or session is established
        currentUser = authData.user;
        toast.success('Akun berhasil dibuat!');

        // Update profile manual check
        if (currentUser) {
          await supabase.from('profiles').update({ name: birthDataInput.name, whatsapp }).eq('user_id', currentUser.id);
        }
      }

      // Submit Lead (if new)
      if (password && whatsapp) {
        await supabase.functions.invoke('submit-lead', {
          body: {
            name: birthDataInput.name,
            email,
            whatsapp,
            birth_date: birthDateStr,
            birth_place: birthDataInput.place,
          }
        });
      }

      // Calculate Chart
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

      if (error) throw error;

      // Save Chart - wait for user to be available if just signed up
      // If signup requires email confirmation, we can't save yet. 
      // Assuming Supabase config allows signin without confirmation or we just proceed.
      // If currentUser is null (confirmation required), we can't save.

      const { data: { user: freshUser } } = await supabase.auth.getUser();
      currentUser = freshUser || currentUser;

      if (currentUser) {
        const { data: savedChart, error: saveError } = await supabase.from('saved_charts').insert({
          user_id: currentUser.id,
          name: birthDataInput.name,
          birth_date: birthDateStr,
          birth_time: birthTimeStr,
          birth_place: birthDataInput.place,
          chart_data: result,
        })
          .select()
          .single();

        if (!saveError) {
          toast.success('Chart berhasil dibuat!');
          await fetchSavedCharts();

          // Show Result Logic
          setCurrentChartData(result);
          setCurrentChartId(savedChart.id);
          setCurrentBirthData({
            name: birthDataInput.name,
            year: birthDataInput.year,
            month: birthDataInput.month,
            day: birthDataInput.day,
            hour: birthDataInput.hour,
            minute: birthDataInput.minute,
            place: birthDataInput.place,
            gender: birthDataInput.gender
          });

          setShowChartModal(false);
          setShowLeadCapture(false);
          setShowResultModal(true);
        }
      } else {
        toast.message('Silakan cek email Anda untuk konfirmasi akun, lalu login untuk menyimpan chart.');
        // Still close modal
        setShowLeadCapture(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.message || error.toString();
      toast.error(`Terjadi kesalahan saat membuat chart: ${errorMessage}`);
    } finally {
      setIsGeneratingChart(false);
    }
  };

  const handleLeadSubmit = async (leadData: { whatsapp: string; email: string; password: string }) => {
    if (!pendingBirthData) return;
    await processChartGeneration(pendingBirthData, leadData.email, leadData.whatsapp, leadData.password);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block text-accent text-sm font-semibold mb-4 uppercase tracking-wider">
              Teman Batin Personal Report
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Co-pilot Batinmu untuk Hidup <span className="text-gradient-fire">Tenang, Pasti, dan Utuh</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
              Kembali ke Diri Sejatimu dengan Panduan 100+ Halaman Berdasarkan Human Design & Bazi
            </p>
            <p className="text-base text-muted-foreground/80 max-w-xl mx-auto mb-4">
              Temukan Potensi Tersembunyi, Karir yang Sesuai & Cara Membuat Keputusan dengan Percaya Diri
            </p>

            {/* Social Proof Counter */}
            <div className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="font-semibold text-foreground">Baru sedikit orang yang mengetahui ini, kamu beruntung!</span>
            </div>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="fire-glow text-lg px-8 py-6"
                onClick={() => finalCtaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                Mulai Perjalanan Transformasi (Gratis)
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-accent" />
                <span>Garansi 100% Report Ulang</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="px-4 py-12 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Hei Teman, Apakah kamu...
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {painPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 glass-card p-4 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-destructive" />
                  </div>
                  <p className="text-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wrong Solutions Section */}
        <section className="px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Parahnya, kamu nyoba kesana kemari ngikutin saran orang yang berujung...
            </h2>
            <div className="space-y-3 max-w-xl mx-auto">
              {wrongSolutions.map((solution, index) => (
                <div key={index} className="flex items-center gap-3 text-muted-foreground glass-card p-3 rounded-lg">
                  <X className="w-5 h-5 text-destructive/60 shrink-0" />
                  <span>{solution}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-foreground/80 mt-6 text-sm italic max-w-xl mx-auto">
              💡 <span className="font-semibold">Plot twist:</span> Kamu tidak perlu "diperbaiki". Kamu hanya perlu memahami cara kerjamu yang unik.
            </p>
          </div>
        </section>

        {/* Solution Section */}
        <section className="px-4 py-16 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">Solusi yang Tepat</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Teman Batin: Blueprint Kehidupan yang Komprehensif
            </h2>
            <p className="text-base text-muted-foreground/90 max-w-2xl mx-auto mb-3">
              Menggunakan <span className="font-semibold text-foreground">Human Design</span> (sistem yang menggabungkan astrologi, I-Ching, Kabbalah, dan Chakra)
              dan <span className="font-semibold text-foreground">Bazi</span> (Four Pillars of Destiny dari tradisi Tiongkok)
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              untuk memberikan pemahaman <span className="font-semibold text-accent">360° tentang desain energi unik Anda</span>—dari cara membuat keputusan hingga timing terbaik untuk bertindak.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {reportBenefits.map((benefit, index) => (
              <div key={index} className="glass-card p-6 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Preview Section */}
        <ReportPreviewSection hideCta={true} />

        {/* Trust Badge Section - Algorithm Assurance */}
        <TrustBadgeSection />

        {/* Comparison Table */}
        <ComparisonTable className="bg-gradient-to-b from-transparent to-secondary/30" />

        {/* Testimonials */}
        <TestimonialsSection className="bg-transparent py-16" />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section - Dynamic based on user state */}
        <section ref={finalCtaRef} className="px-4 py-16">
          <div className="max-w-4xl mx-auto glass-card rounded-2xl p-6 md:p-10 lg:p-12">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-accent mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Siap untuk Hidup Tenang, Pasti, dan Utuh?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Kamu sudah lihat apa yang kamu dapat. Sekarang waktunya mengambil langkah pertama menuju pemahaman sejati tentang dirimu.
              </p>

              {/* Quick Benefit Recap - Result-Oriented & Centered */}
              <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-8 gap-y-3 max-w-3xl mx-auto mb-8">
                <div className="flex items-center gap-2 text-xs md:text-sm lg:text-base text-foreground font-medium group">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30 group-hover:bg-accent/30 transition-colors">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                  </div>
                  <span>Pengiriman Instan</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm lg:text-base text-foreground font-medium group">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30 group-hover:bg-accent/30 transition-colors">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                  </div>
                  <span>100+ Halaman</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm lg:text-base text-foreground font-medium group">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30 group-hover:bg-accent/30 transition-colors">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                  </div>
                  <span>Full Personalized</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">Investment untuk pemahaman seumur hidup:</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl font-bold text-accent">{formatPrice(PRODUCTS.FULL_REPORT.price)}</span>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(PRODUCTS.FULL_REPORT.original_price)}</span>
                <span className="bg-accent/20 text-accent text-xs font-semibold px-2 py-1 rounded">
                  HEMAT {Math.round(((PRODUCTS.FULL_REPORT.original_price - PRODUCTS.FULL_REPORT.price) / PRODUCTS.FULL_REPORT.original_price) * 100)}%
                </span>
              </div>

              {/* Urgency Element */}
              <div className="inline-flex items-center gap-2 bg-destructive/20 text-destructive px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">Penawaran Terbatas: Tersisa 8 slot hari ini</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : user ? (
              /* User logged in */
              <div className="text-center">
                <Button
                  size="lg"
                  className="fire-glow text-lg px-8 py-6 mb-4"
                  onClick={() => setShowUnifiedCheckout(true)}
                >
                  Dapatkan Full Report kamu Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-sm text-muted-foreground">
                  <button
                    onClick={() => setShowChartModal(true)}
                    className="text-accent hover:underline"
                  >
                    Mau Lihat Chart dulu?
                  </button>
                </p>
              </div>
            ) : (
              /* Not logged in */
              <div className="text-center">
                <Button
                  size="lg"
                  className="fire-glow text-lg px-8 py-6 mb-4"
                  onClick={() => setShowUnifiedCheckout(true)}
                >
                  Dapatkan Full Report kamu Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-sm text-muted-foreground">
                  <button
                    onClick={() => setShowChartModal(true)}
                    className="text-accent hover:underline"
                  >
                    Mau Lihat Chart dulu?
                  </button>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Shop Link */}
        <section className="px-4 py-8 text-center">
          <Link to="/shop" className="text-accent hover:underline inline-flex items-center gap-2">
            Lihat semua produk digital kami
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
        {/* Modals */}
        <ChartGenerationModal
          isOpen={showChartModal}
          onClose={() => setShowChartModal(false)}
          onSubmit={handleChartSubmit}
          isLoading={isGeneratingChart}
        />

        <LeadCaptureModal
          isOpen={showLeadCapture}
          onClose={() => setShowLeadCapture(false)}
          onSubmit={handleLeadSubmit}
          isLoading={isGeneratingChart}
        />

        {isGeneratingChart && <LoadingAnimation />}

        {/* Result Modal */}
        <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
          <DialogContent className="max-w-[95vw] h-[95vh] p-0 border-none bg-background overflow-hidden flex flex-col">
            <div className="h-full overflow-y-auto relative">
              <Button
                onClick={() => setShowResultModal(false)}
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-50 rounded-full bg-background/50 hover:bg-background border border-border"
              >
                <X className="w-5 h-5" />
              </Button>
              {currentChartData && (
                <ChartResult
                  data={currentChartData}
                  userName={currentBirthData?.name || ''}
                  userEmail={user?.email || ''}
                  userPhone=""
                  birthData={currentBirthData}
                  chartId={currentChartId}
                  userId={user?.id}
                  onReset={() => {
                    setShowResultModal(false);
                    setShowChartModal(true);
                  }}
                  isOrdered={currentChartId ? isChartOrdered(currentChartId) : false}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Checkout Preview Modal */}
      <Dialog open={showCheckoutPreview} onOpenChange={setShowCheckoutPreview}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gradient-fire">
              Konfirmasi Pesanan
            </DialogTitle>
            <DialogDescription>
              Pastikan data di bawah sudah benar sebelum melanjutkan pembayaran.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Billing Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Data Pemesan</h3>
                {user && (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleUseAccountData(!useAccountData)}
                  >
                    <Checkbox
                      checked={useAccountData}
                      onCheckedChange={(checked) => handleUseAccountData(checked as boolean)}
                      className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <label className="text-sm text-muted-foreground cursor-pointer">
                      Sama dengan akun
                    </label>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="billing-name">Nama Pemesan</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="billing-name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="billing-email"
                      type="email"
                      placeholder="contoh@email.com"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-whatsapp">Nomor WhatsApp</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="billing-whatsapp"
                      type="tel"
                      placeholder="+628123456789"
                      value={billingWhatsapp}
                      onChange={(e) => handleWhatsappChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Report akan dikirim ke email dan notifikasi via WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Detail Pesanan</h3>
              {getSelectedChartDetails().map((chart) => (
                <div key={chart.id} className="bg-secondary/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{chart.name}</p>
                      <p className="text-sm text-accent">Full Personal Report</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">{formatPrice(PRODUCTS.FULL_REPORT.price)}</span>
                      <span className="text-xs text-muted-foreground line-through ml-1">{formatPrice(PRODUCTS.FULL_REPORT.original_price)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1 mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Tanggal Lahir: <strong className="text-foreground">{formatDate(chart.birth_date)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Jam Lahir: <strong className="text-foreground">{formatTime(chart.birth_time)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Tempat Lahir: <strong className="text-foreground">{chart.birth_place || '-'}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Features included */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3">Yang Anda dapatkan:</h4>
              <div className="grid grid-cols-1 gap-2">
                {reportFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing time info */}
            <div className="bg-secondary/50 border border-border rounded-lg p-4">
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground mb-1">Waktu Pemrosesan</p>
                  <p className="text-muted-foreground">
                    Full Report akan dikirim ke email Anda <strong className="text-foreground">secara instan (otomatis)</strong> setelah pembayaran dikonfirmasi.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Saya menyetujui Syarat dan Ketentuan
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Dengan mencentang ini, Anda setuju dengan{' '}
                    <span
                      className="text-accent cursor-pointer hover:underline"
                      onClick={() => setShowTncModal(true)}
                    >
                      Syarat dan Ketentuan
                    </span>{' '}
                    yang berlaku.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="tnc"
                  checked={agreedToTnc}
                  onCheckedChange={(checked) => setAgreedToTnc(checked as boolean)}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="tnc"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Data yang saya masukkan sudah benar
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Saya telah memeriksa kembali nama, email, dan data kelahiran. Kesalahan data bukan tanggung jawab kami setelah report diproses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-4">
            <Button
              className="w-full fire-glow py-6 text-lg"
              onClick={handleConfirmPayment}
              disabled={isProcessingPayment || !agreedToTerms || !agreedToTnc}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Bayar Sekarang
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCheckoutPreview(false)}
              disabled={isProcessingPayment}
            >
              Batal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* T&C Modal */}
      <Dialog open={showTncModal} onOpenChange={setShowTncModal}>
        <DialogContent className="sm:max-w-lg bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Syarat dan Ketentuan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              1. <strong>Data Kelahiran:</strong> Akurasi report sangat bergantung pada data kelahiran (jam & menit). Pastikan data yang Anda masukkan akurat.
            </p>
            <p>
              2. <strong>Waktu Layanan:</strong> Report akan dikirimkan ke email Anda secara instan (otomatis dalam hitungan menit) setelah pembayaran dikonfirmasi.
            </p>
            <p>
              3. <strong>Kebijakan Garansi:</strong> Kami memberikan garansi 100% pembuatan report ulang jika ada kesalahan dalam perhitungan atau report tidak sesuai dengan data yang Anda berikan.
            </p>
            <p>
              4. <strong>Privasi:</strong> Data kelahiran Anda hanya digunakan untuk pembuatan chart dan tidak akan disebarluaskan.
            </p>
            <p>
              5. <strong>Non-Transferable:</strong> Report ini dibuat khusus untuk Anda dan tidak dapat dipindahtangankan manfaatnya.
            </p>
          </div>
          <div className="pt-4">
            <Button onClick={() => setShowTncModal(false)} className="w-full">
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unified Checkout Modal (New Phase 2) */}
      <UnifiedCheckoutModal
        open={showUnifiedCheckout}
        onOpenChange={setShowUnifiedCheckout}
        onSubmit={async (data) => {
          setIsGeneratingChart(true);
          try {
            let currentUser = user;

            // Helper: Format WhatsApp (08xx -> 628xx)
            const formatWhatsApp = (number: string): string => {
              if (!number || number.trim() === '') {
                throw new Error('WhatsApp number is required');
              }
              let cleaned = number.replace(/\D/g, ''); // Remove non-digits
              if (cleaned.startsWith('0')) {
                cleaned = '62' + cleaned.slice(1);
              }
              if (!cleaned.startsWith('62')) {
                cleaned = '62' + cleaned;
              }
              return '+' + cleaned;
            };

            // Validate whatsapp before formatting
            if (!data.whatsapp || data.whatsapp.trim() === '') {
              toast.error('Nomor WhatsApp wajib diisi');
              setIsGeneratingChart(false);
              return;
            }

            const formattedWhatsapp = formatWhatsApp(data.whatsapp);

            // 1. Handle Auth (Signup) if not logged in
            if (!currentUser && data.password) {
              const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                  data: { name: data.name, whatsapp: formattedWhatsapp },
                },
              });

              if (authError) {
                if (authError.message.includes('User already registered') || authError.status === 422) {
                  toast.error('Email sudah terdaftar. Silakan Log In di menu untuk melanjutkan.', {
                    duration: 5000,
                    action: {
                      label: 'Log In',
                      onClick: () => navigate('/login')
                    }
                  });
                  setIsGeneratingChart(false);
                  return;
                }
                throw new Error(authError.message);
              }
              currentUser = authData.user;

              if (currentUser) {
                await supabase.from('profiles').update({
                  name: data.name,
                  whatsapp: formattedWhatsapp
                }).eq('user_id', currentUser.id);
              }
            }

            // 2. Prepare Date Strings
            const [year, month, day] = data.birthDate.split('-').map(Number);
            const [hour, minute] = data.birthTime.split(':').map(Number);

            if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
              toast.error("Format tanggal atau waktu tidak valid");
              setIsGeneratingChart(false);
              return;
            }

            // Validate City
            if (!data.birthCity || data.birthCity.trim().length === 0) {
              toast.error("Kota kelahiran wajib diisi");
              setIsGeneratingChart(false);
              return;
            }

            const birthDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Submit Lead
            try {
              await supabase.functions.invoke('submit-lead', {
                body: {
                  name: data.name,
                  email: data.email,
                  whatsapp: formattedWhatsapp,
                  birth_date: birthDateStr,
                  birth_place: data.birthCity,
                }
              });
            } catch (leadError) {
              console.warn("Lead submission failed, continuing...", leadError);
            }

            // 3. Calculate Chart
            const { data: chartResult, error: chartError } = await supabase.functions.invoke('calculate-chart', {
              body: {
                year, month, day, hour, minute,
                place: data.birthCity,
                gender: data.gender,
              },
            });

            if (chartError) throw chartError;

            // 4. Save Chart to DB
            const { data: { user: freshUser } } = await supabase.auth.getUser();
            currentUser = freshUser || currentUser;

            if (!currentUser) {
              toast.error("Silakan cek email untuk konfirmasi akun, lalu login kembali.");
              setIsGeneratingChart(false);
              return;
            }

            const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

            const { data: savedChart, error: saveError } = await supabase.from('saved_charts').insert({
              user_id: currentUser.id,
              name: data.name,
              birth_date: birthDateStr,
              birth_time: timeStr,
              birth_place: data.birthCity,
              chart_data: chartResult,
            })
              .select()
              .single();

            if (saveError) throw saveError;

            setCurrentChartId(savedChart.id);

            // 5. Create Order & Trigger Midtrans
            const referenceId = `TB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            const productName = 'Human Design Full Personal Report';

            // Create Order
            // @ts-ignore
            const { error: orderError } = await supabase
              .from('orders')
              .insert({
                user_id: user?.id || null,
                reference_id: referenceId,
                customer_name: data.name,
                customer_email: data.email,
                customer_phone: formattedWhatsapp,
                product_name: productName,
                amount: PRODUCTS.FULL_REPORT.price,
                status: 'PENDING',
                metadata: {
                  chart_ids: [savedChart.id],
                  products: ['full_report'],
                  birth_data: {
                    name: data.name,
                    date: data.birthDate,
                    time: data.birthTime,
                    city: data.birthCity,
                    gender: data.gender
                  }
                }
              });

            if (orderError) throw orderError;

            // Call Midtrans
            const { data: paymentData, error: paymentError } = await supabase.functions.invoke('midtrans-checkout', {
              body: {
                referenceId: referenceId,
                customerName: data.name,
                customerEmail: data.email,
                customerPhone: formattedWhatsapp,
                amount: PRODUCTS.FULL_REPORT.price,
                productName: productName,
                chartIds: [savedChart.id],
                products: ['full_report'],
                birthData: {
                  name: data.name,
                  date: data.birthDate,
                  time: data.birthTime,
                  city: data.birthCity,
                  gender: data.gender
                }
              }
            });

            if (paymentError) throw paymentError;

            if (paymentData && paymentData.redirect_url) {
              setShowUnifiedCheckout(false);

              // Use redirect_url directly
              window.location.href = paymentData.redirect_url;

              /* 
              // Legacy Snap Popup - replaced with Direct Redirect for better compatibility
              if ((window as any).snap) {
                (window as any).snap.pay(paymentData.token, {
                  onSuccess: function (result: any) { xmlns: ... }
                });
              } 
              */
            }

          } catch (error: any) {
            console.error(error);
            toast.error('Terjadi kesalahan: ' + (error.message || "Unknown error"));
          } finally {
            setIsGeneratingChart(false);
          }
        }}
        isLoading={isGeneratingChart}
        user={user}
      />

      <Footer />

      {/* Floating CTA Button */}
      {showFloatingCTA && (
        <div className="fixed bottom-6 left-0 right-0 z-50 px-4 animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col gap-2 items-center">
              <div className="bg-white text-[hsl(160_84%_5%)] text-xs md:text-sm font-bold py-1.5 px-3 md:px-4 rounded-full flex items-center gap-1.5 shadow-lg border border-[hsl(160_84%_5%)]/10">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse text-[hsl(160_84%_5%)]" />
                Penawaran Terbatas: Tersisa 8 slot hari ini
              </div>
              <Button
                size="lg"
                className="w-full fire-glow py-7 shadow-2xl relative overflow-hidden group"
                onClick={() => finalCtaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-sm font-bold tracking-wide">Dapatkan Full Report Sekarang</span>
                  <span className="text-[10px] opacity-80 font-medium">Investasi terbaik untuk dirimu</span>
                </div>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
