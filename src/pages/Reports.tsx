import { useState, useEffect } from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Check, X, ArrowRight, Star, Shield, Clock, FileText, Plus, Calendar, MapPin, Loader2, AlertTriangle, CreditCard, Mail, Phone, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
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
    title: 'Analisis Mendalam 40+ Halaman',
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

const REPORT_PRICE = 149000;
const ORIGINAL_PRICE = 1550000;

const reportFeatures = [
  'Analisis mendalam 40+ halaman',
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          setTimeout(() => {
            fetchSavedCharts();
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
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
      setUserProfile(profileData);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleChartSelection = (chartId: string) => {
    setSelectedCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };

  const selectAllCharts = () => {
    if (selectedCharts.length === savedCharts.length) {
      setSelectedCharts([]);
    } else {
      setSelectedCharts(savedCharts.map(c => c.id));
    }
  };

  const getTotalPrice = () => {
    return selectedCharts.length * REPORT_PRICE;
  };

  const getOriginalTotalPrice = () => {
    return selectedCharts.length * ORIGINAL_PRICE;
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
      const productNames = selectedChartDetails.map(c => `Full Report: ${c.name}`).join(', ');

      const { data, error } = await supabase.functions.invoke('doku-checkout', {
        body: {
          customerName: billingName,
          customerEmail: billingEmail,
          customerPhone: billingWhatsapp,
          amount: getTotalPrice(),
          productName: productNames,
          chartIds: selectedCharts,
        },
      });

      if (error) {
        console.error('Payment error:', error);
        toast.error('Gagal memproses pembayaran. Silakan coba lagi.');
        return;
      }

      if (data?.success && data?.paymentUrl) {
        toast.success('Mengarahkan ke halaman pembayaran...');
        // Redirect to DOKU payment page
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data?.error || 'Gagal mendapatkan link pembayaran');
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleAddNewChart = () => {
    navigate('/#calculator');
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block text-accent text-sm font-semibold mb-4 uppercase tracking-wider">
              Full Personalized Report
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
                Laporan 40+ halaman yang dipersonalisasi berdasarkan data kelahiran Anda.
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-accent">{formatPrice(REPORT_PRICE)}</span>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(ORIGINAL_PRICE)}</span>
                <span className="bg-accent/20 text-accent text-xs font-semibold px-2 py-1 rounded">HEMAT 4%</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : user && savedCharts.length > 0 ? (
              /* User has charts - show selection */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Pilih Chart untuk Full Report
                  </h3>
                  <button
                    onClick={selectAllCharts}
                    className="text-sm text-accent hover:underline"
                  >
                    {selectedCharts.length === savedCharts.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                  </button>
                </div>

                <div className="space-y-3">
                  {savedCharts.map((chart) => (
                    <div
                      key={chart.id}
                      onClick={() => toggleChartSelection(chart.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedCharts.includes(chart.id)
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedCharts.includes(chart.id)}
                          onCheckedChange={() => toggleChartSelection(chart.id)}
                          className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{chart.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(chart.birth_date)}
                            </span>
                            {chart.birth_place && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {chart.birth_place.split(',')[0]}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-accent font-semibold">{formatPrice(REPORT_PRICE)}</span>
                          <span className="text-xs text-muted-foreground line-through ml-2">{formatPrice(ORIGINAL_PRICE)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new chart option */}
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2 py-6"
                  onClick={handleAddNewChart}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Tambah Chart Baru
                </Button>

                {/* Summary and checkout */}
                {selectedCharts.length > 0 && (
                  <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {selectedCharts.length} Full Report
                      </span>
                      <div className="text-right">
                        <span className="text-xl font-bold text-foreground">
                          {formatPrice(getTotalPrice())}
                        </span>
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {formatPrice(getOriginalTotalPrice())}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="w-full fire-glow text-lg py-6"
                      onClick={handleCheckoutClick}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Lanjut ke Pembayaran
                    </Button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-accent" />
                    Jaminan uang kembali 30 hari
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-accent" />
                    Dikirim dalam 24 jam
                  </div>
                </div>
              </div>
            ) : user ? (
              /* User logged in but no charts */
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  Anda belum memiliki chart. Buat chart gratis terlebih dahulu untuk memesan Full Report.
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
                      <p className="text-sm text-accent">Full Foundation Report</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">{formatPrice(REPORT_PRICE)}</span>
                      <span className="text-xs text-muted-foreground line-through ml-1">{formatPrice(ORIGINAL_PRICE)}</span>
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

            {/* Warning */}
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-destructive mb-1">Penting!</p>
                  <p className="text-foreground">
                    Pastikan tanggal, jam, dan tempat lahir sudah benar. Laporan yang dibuat berdasarkan data kelahiran yang salah <strong>tidak dapat di-refund</strong> karena chart sudah dihitung berdasarkan data yang Anda berikan.
                  </p>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div 
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
              >
                <Checkbox
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-0.5 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <label className="text-sm text-muted-foreground cursor-pointer">
                  Saya sudah memastikan data kelahiran di atas benar dan memahami bahwa kesalahan data tidak dapat di-refund.
                </label>
              </div>

              <div 
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setAgreedToTnc(!agreedToTnc)}
              >
                <Checkbox
                  checked={agreedToTnc}
                  onCheckedChange={(checked) => setAgreedToTnc(checked as boolean)}
                  className="mt-0.5 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <label className="text-sm text-muted-foreground cursor-pointer">
                  Saya sudah membaca dan menyetujui{' '}
                  <button 
                    type="button"
                    className="text-accent hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTncModal(true);
                    }}
                  >
                    Syarat dan Ketentuan
                  </button>{' '}
                  website.
                </label>
              </div>
            </div>

            {/* Total */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Total ({selectedCharts.length} report)</span>
                <div>
                  <span className="text-sm text-muted-foreground line-through mr-2">{formatPrice(getOriginalTotalPrice())}</span>
                  <span className="text-2xl font-bold text-accent">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-right">
                Hemat {formatPrice(getOriginalTotalPrice() - getTotalPrice())}!
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCheckoutPreview(false)}
              >
                Kembali
              </Button>
              <Button
                className="flex-1 fire-glow"
                onClick={handleConfirmPayment}
                disabled={!agreedToTerms || !agreedToTnc || isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Bayar Sekarang
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms and Conditions Modal */}
      <Dialog open={showTncModal} onOpenChange={setShowTncModal}>
        <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">
              Syarat & Ketentuan
            </DialogTitle>
            <DialogDescription>
              Terakhir diperbarui: Januari 2026
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2 space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-foreground mb-2">1. Penerimaan Ketentuan</h3>
              <p className="text-muted-foreground">
                Dengan mengakses dan menggunakan layanan Teman Batin, Anda menyetujui untuk 
                terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan ketentuan 
                ini, harap tidak menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">2. Deskripsi Layanan</h3>
              <p className="text-muted-foreground">
                Teman Batin menyediakan layanan perhitungan Human Design Chart berdasarkan 
                data kelahiran yang Anda berikan. Layanan ini bersifat informatif dan tidak 
                dimaksudkan sebagai pengganti nasihat profesional medis, psikologis, atau 
                hukum.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">3. Akurasi Informasi</h3>
              <p className="text-muted-foreground">
                Akurasi hasil Human Design Chart bergantung pada keakuratan data kelahiran 
                yang Anda berikan. Kami tidak bertanggung jawab atas ketidakakuratan hasil 
                yang disebabkan oleh data yang salah atau tidak lengkap.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">4. Penggunaan Layanan</h3>
              <p className="text-muted-foreground mb-2">Anda setuju untuk:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Memberikan informasi yang akurat dan lengkap</li>
                <li>Menggunakan layanan hanya untuk tujuan personal dan non-komersial</li>
                <li>Tidak menyalin atau mendistribusikan konten tanpa izin</li>
                <li>Tidak menggunakan layanan untuk aktivitas ilegal</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">5. Hak Kekayaan Intelektual</h3>
              <p className="text-muted-foreground">
                Semua konten, termasuk teks, grafik, logo, dan perangkat lunak yang tersedia 
                di platform ini adalah milik Teman Batin dan dilindungi oleh undang-undang 
                hak cipta.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">6. Batasan Tanggung Jawab</h3>
              <p className="text-muted-foreground">
                Teman Batin tidak bertanggung jawab atas kerugian langsung, tidak langsung, 
                insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan 
                menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">7. Perubahan Ketentuan</h3>
              <p className="text-muted-foreground">
                Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan 
                berlaku segera setelah dipublikasikan di situs web.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">8. Hukum yang Berlaku</h3>
              <p className="text-muted-foreground">
                Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum 
                Republik Indonesia.
              </p>
            </section>
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <Button 
              className="w-full" 
              onClick={() => setShowTncModal(false)}
            >
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
