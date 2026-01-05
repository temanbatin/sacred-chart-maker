import { useState, useEffect } from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Check, X, ArrowRight, Star, Shield, Clock, FileText, Plus, ShoppingCart, Trash2, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

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

const REPORT_PRICE = 299000; // Rp 299.000

const Reports = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchSavedCharts();
          }, 0);
        } else {
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
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
    setIsLoading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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

  const handleCheckout = () => {
    if (selectedCharts.length === 0) {
      toast.error('Pilih minimal 1 chart untuk melanjutkan');
      return;
    }
    // TODO: Implement checkout flow
    toast.success(`${selectedCharts.length} chart ditambahkan ke keranjang!`);
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
              <p className="text-muted-foreground max-w-xl mx-auto">
                Laporan 40+ halaman yang dipersonalisasi berdasarkan data kelahiran Anda. Pahami diri Anda lebih dalam dan hidup sesuai desain sejati Anda.
              </p>
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new chart option */}
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2 py-6"
                  asChild
                >
                  <Link to="/">
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Chart Baru
                  </Link>
                </Button>

                {/* Summary and checkout */}
                {selectedCharts.length > 0 && (
                  <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-muted-foreground">
                        {selectedCharts.length} Full Report
                      </span>
                      <span className="font-bold text-foreground">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                    <Button
                      size="lg"
                      className="w-full fire-glow text-lg py-6"
                      onClick={handleCheckout}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
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
                  asChild
                >
                  <Link to="/">
                    Buat Chart Gratis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
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
                  asChild
                >
                  <Link to="/">
                    Buat Chart Gratis Dulu
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
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

      <Footer />
    </div>
  );
};

export default Reports;
