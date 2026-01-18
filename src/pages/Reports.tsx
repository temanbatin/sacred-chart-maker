import { useState, useEffect } from 'react';
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
  'Merasa hidup tidak sesuai dengan diri sejati Anda',
  'Sering merasa kelelahan atau burnout tanpa tahu penyebabnya',
  'Kesulitan membuat keputusan yang tepat',
  'Merasa tidak dipahami oleh orang lain',
  'Mencari tujuan hidup yang sebenarnya',
];

const wrongSolutions = [
  'Mengikuti saran orang lain yang tidak sesuai dengan desain Anda',
  'Memaksakan diri untuk menjadi seperti orang lain',
  'Mengabaikan intuisi dan sinyal tubuh Anda',
  'Membuat keputusan berdasarkan logika semata',
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

const testimonials = [
  {
    name: 'Sarah W.',
    type: 'Generator',
    quote: 'Full Report ini benar-benar membuka mata saya. Akhirnya saya paham kenapa saya selalu merasa tidak cocok dengan pekerjaan kantoran!',
  },
  {
    name: 'Budi P.',
    type: 'Projector',
    quote: 'Sebagai Projector, saya belajar bahwa menunggu undangan adalah kunci sukses saya. Laporan ini mengubah cara saya berbisnis.',
  },
];

import { PRICING_CONFIG, PRODUCTS, formatPrice } from '@/config/pricing';

const reportFeatures = [
  'Analisis mendalam 100+ halaman',
  'Profil lengkap: Tipe, Strategi & Otoritas',
  'Analisis 9 Energy Center',
  'Panduan karir & hubungan',
  'Peta potensi tersembunyi',
  'Tips kesehatan & vitalitas',
  'Panduan pengambilan keputusan',
];

const Reports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckoutPreview, setShowCheckoutPreview] = useState(false);
  const [showTncModal, setShowTncModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToTnc, setAgreedToTnc] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string | null; whatsapp: string | null } | null>(null);

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
        // Redirect to iPaymu payment page
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
              Personal Report
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Temukan <span className="text-gradient-fire">Cetak Biru</span> Kehidupan Anda
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Laporan Human Design personal yang mendalam untuk membantu Anda hidup sesuai dengan desain sejati Anda.
            </p>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="px-4 py-12 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Apakah Anda Mengalami Ini?
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
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
              Solusi yang Tidak Bekerja
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Banyak orang mencoba berbagai cara untuk menemukan diri, tapi tanpa pemahaman tentang desain unik mereka:
            </p>
            <div className="space-y-3 max-w-xl mx-auto">
              {wrongSolutions.map((solution, index) => (
                <div key={index} className="flex items-center gap-3 text-muted-foreground">
                  <X className="w-5 h-5 text-destructive/60 shrink-0" />
                  <span>{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="px-4 py-16 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">Solusi yang Tepat</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Human Design: Peta Perjalanan Hidup Anda
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Human Design menggabungkan astrologi, I-Ching, Kabbalah, dan sistem Chakra untuk memberikan pemahaman yang unik tentang siapa Anda sebenarnya.
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

        {/* Testimonials */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              Apa Kata Mereka?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="glass-card p-6 rounded-xl">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-accent font-semibold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Dynamic based on user state */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto glass-card rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-accent mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Dapatkan Full Report Anda
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-4">
                Laporan 100+ halaman yang dipersonalisasi berdasarkan data kelahiran Anda.
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-accent">Mulai {formatPrice(PRODUCTS.ESSENTIAL_REPORT.price)}</span>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(PRODUCTS.ESSENTIAL_REPORT.original_price)}</span>
                <span className="bg-accent/20 text-accent text-xs font-semibold px-2 py-1 rounded">
                  HEMAT {Math.round(((PRODUCTS.ESSENTIAL_REPORT.original_price - PRODUCTS.ESSENTIAL_REPORT.price) / PRODUCTS.ESSENTIAL_REPORT.original_price) * 100)}%
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : user ? (
              /* User logged in */
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  Buat chart gratis terlebih dahulu untuk memesan Full Report.
                </p>
                <Button
                  size="lg"
                  className="fire-glow text-lg px-8 py-6"
                  onClick={handleAddNewChart}
                >
                  Buat Chart Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            ) : (
              /* Not logged in */
              <div className="text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-accent" />
                    Jaminan uang kembali 30 hari
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-accent" />
                    Dikirim dalam 24 jam
                  </div>
                </div>

                <Button
                  size="lg"
                  className="fire-glow text-lg px-8 py-6"
                  onClick={handleAddNewChart}
                >
                  Buat Chart Gratis Dulu
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  *Untuk membeli Full Report, Anda perlu membuat chart gratis terlebih dahulu
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
                      <p className="text-sm text-accent">Personal Report (Mulai)</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">{formatPrice(PRODUCTS.ESSENTIAL_REPORT.price)}</span>
                      <span className="text-xs text-muted-foreground line-through ml-1">{formatPrice(PRODUCTS.ESSENTIAL_REPORT.original_price)}</span>
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
                    Full Report akan dikirim ke email Anda dalam waktu <strong className="text-foreground">maksimal 24 jam</strong> setelah pembayaran dikonfirmasi.
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
              2. <strong>Waktu Layanan:</strong> Report akan dikirimkan ke email Anda dalam waktu maksimal 24 jam setelah pembayaran dikonfirmasi.
            </p>
            <p>
              3. <strong>Kebijakan Refund:</strong> Kami memberikan garansi uang kembali 30 hari jika Anda tidak mendapatkan manfaat dari report ini, dengan syarat Anda telah membaca dan mempelajarinya.
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

      <Footer />
    </div>
  );
};

export default Reports;
