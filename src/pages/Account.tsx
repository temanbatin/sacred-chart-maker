import { useState, useEffect, useCallback } from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { User, FileText, Clock, ArrowRight, LogIn, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Calendar, MapPin, CreditCard, CheckCircle2, Sparkles, Fingerprint } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { ChartResult, ChartData } from '@/components/ChartResult';
import { BirthData as BirthDataForChart } from '@/components/MultiStepForm';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AffiliateDashboard } from "@/components/AffiliateDashboard";
import methodologyHero from '@/assets/methodology-hero.png';

interface SavedChart {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string | null;
  birth_place: string | null;
  chart_data: ChartData;
  created_at: string;
}

interface Order {
  id: string;
  reference_id: string;
  created_at: string;
  product_name: string;
  status: string;
  amount: number;
  payment_url?: string;
  paid_at?: string;
  report_url?: string;
  [key: string]: unknown;
}

const Account = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [selectedChart, setSelectedChart] = useState<SavedChart | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Get email from URL params (for signup from payment result)
  const urlEmail = searchParams.get('email') || '';
  const urlRef = searchParams.get('ref') || '';

  const checkAdminRole = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!error && data && (data as any).role === 'admin') {
      toast.success('Selamat datang, Admin!');
      navigate('/admin');
    }
  }, [navigate]);

  /* Purchased Reports - fetch by user_id OR email */
  const fetchOrders = useCallback(async (userEmail?: string, userId?: string) => {
    if (!userEmail && !userId) return;

    // Fetch orders where user_id matches OR customer_email matches
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`user_id.eq.${userId},customer_email.eq.${userEmail}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders((data || []) as unknown as Order[]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders(user.email, user.id);
    }
  }, [user, fetchOrders]);


  // Function to save pending chart from sessionStorage after login/signup
  const savePendingChart = async (userId: string) => {
    const pendingChartData = sessionStorage.getItem('pendingChart');
    if (!pendingChartData) return;

    try {
      const chart = JSON.parse(pendingChartData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('saved_charts') as any)
        .insert({
          user_id: userId,
          name: chart.name,
          birth_date: chart.birth_date,
          birth_time: chart.birth_time,
          birth_place: chart.birth_place,
          chart_data: chart.chart_data,
        });

      if (!error) {
        sessionStorage.removeItem('pendingChart');
        toast.success('Chart kamu berhasil disimpan ke akun!');
      }
    } catch (e) {
      console.error('Error saving pending chart:', e);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        if (session?.user) {
          setTimeout(async () => {
            try {
              await supabase.rpc('claim_guest_data');
            } catch (err) {
              console.error('Error claiming guest data:', err);
            }
            fetchSavedCharts();
            savePendingChart(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.user) {
        checkAdminRole(session.user.id);
        supabase.rpc('claim_guest_data').then(() => {
          fetchSavedCharts();
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminRole]);

  const fetchSavedCharts = async () => {
    const { data, error } = await supabase
      .from('saved_charts')
      .select('id, name, birth_date, birth_time, birth_place, chart_data, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching charts:', error);
    } else {
      const uniqueCharts = (data || []).reduce((acc: SavedChart[], current) => {
        // Force cast to match interface if needed, or rely on loose matching if simple
        const chartItem = current as unknown as SavedChart;

        const signature = `${chartItem.name}|${chartItem.birth_date}|${chartItem.birth_time}|${chartItem.birth_place}`;
        const isDuplicate = acc.some(item =>
          `${item.name}|${item.birth_date}|${item.birth_time}|${item.birth_place}` === signature
        );

        if (!isDuplicate) {
          acc.push(chartItem);
        }
        return acc;
      }, []);

      setSavedCharts(uniqueCharts);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/account',
      },
    });

    if (error) {
      toast.error('Gagal login dengan Google: ' + error.message);
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSavedCharts([]);
    setSelectedChart(null);
    toast.success('Berhasil keluar');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleViewChart = (chart: SavedChart) => {
    setSelectedChart(chart);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedChart(null);
  };

  const getBirthDataFromChart = (chart: SavedChart): BirthDataForChart | null => {
    if (!chart.birth_date) return null;

    const [year, month, day] = chart.birth_date.split('-').map(Number);
    let hour = 12, minute = 0;

    if (chart.birth_time) {
      const timeParts = chart.birth_time.split(':');
      hour = parseInt(timeParts[0], 10);
      minute = parseInt(timeParts[1], 10);
    }

    return {
      name: chart.name,
      year,
      month,
      day,
      hour,
      minute,
      place: chart.birth_place || '',
      gender: chart.chart_data?.gender || 'male',
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Simple Gradient Background like Homepage */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-secondary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[100px] rounded-full mix-blend-screen pointer-events-none translate-y-1/3" />

        <MainNavbar />

        <main className="flex-1 flex items-center justify-center pt-32 pb-16 px-4 relative z-10">
          <div className="max-w-[480px] w-full animate-fade-up">
            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden border-border/50 shadow-2xl backdrop-blur-xl">

              {/* Icon removed as requested */}

              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                Portal <span className="text-gradient-fire">Dashboard</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-sm mx-auto">
                Masuk untuk mengakses chart dan laporan premium kamu.
              </p>

              <div className="space-y-8">
                <Button
                  type="button"
                  size="lg"
                  className="w-full bg-white hover:bg-gray-50 text-[hsl(160_84%_5%)] h-16 rounded-2xl shadow-xl hover:shadow-fire hover:scale-[1.02] transition-all duration-300 font-bold text-xl flex items-center justify-center gap-4 group relative overflow-hidden"
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      <svg className="w-7 h-7" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Daftar/Login dengan Google
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-1 gap-4 pt-4">
                  <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-foreground/80 text-sm font-medium">Tanpa perlu verifikasi email manual</p>
                  </div>
                  <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-foreground/80 text-sm font-medium">Masuk cepat dalam hitungan detik</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <Link
                    to="/"
                    className="group text-accent hover:text-accent-hover transition-all inline-flex items-center gap-2 font-semibold text-lg hover:tracking-wide duration-300"
                  >
                    Belum punya chart?
                    <span className="underline decoration-accent/50 underline-offset-4 group-hover:decoration-accent">Buat Disini</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Show selected chart
  if (selectedChart) {
    const birthData = getBirthDataFromChart(selectedChart);

    return (
      <div className="min-h-screen bg-background">
        <MainNavbar />

        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto mb-6">
            <Button variant="ghost" onClick={handleBackToList} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar Chart
            </Button>
          </div>

          <ChartResult
            data={selectedChart.chart_data}
            userName={selectedChart.name}
            userEmail={user.email || ''}
            userPhone=""
            birthData={birthData}
            chartId={selectedChart.id}
            userId={user.id}
            onReset={handleBackToList}
            className="pt-4"
          />
        </main>

        <Footer />
      </div>
    );
  }



  const getStatusBadge = (status: string, createdAt: string) => {
    // Check for expiration (24 hours)
    const isExpired = status === 'PENDING' && (new Date().getTime() - new Date(createdAt).getTime() > 24 * 60 * 60 * 1000);

    if (isExpired || status === 'EXPIRED') {
      return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">Kedaluwarsa</span>;
    }

    switch (status) {
      case 'PAID':
        return <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">Lunas</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">Menunggu Pembayaran</span>;
      case 'FAILED':
        return <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded-full">Gagal</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Charts</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Keluar
            </Button>
          </div>



          {/* Main Content Tabs */}
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="charts">Chart Saya</TabsTrigger>
              <TabsTrigger value="orders">Laporan</TabsTrigger>
              <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-6">
              {savedCharts.length === 0 ? (
                <div className="glass-card rounded-xl p-8 text-center animate-fade-up">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Kamu belum memiliki chart tersimpan
                  </p>
                  <Button asChild>
                    <Link to="/">
                      Buat Chart Pertama Kamu
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 animate-fade-up">
                  {savedCharts.map((chart) => (
                    <div key={chart.id} className="glass-card rounded-xl p-6 hover:border-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground text-lg">{chart.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(chart.birth_date)}
                            </span>
                            {chart.birth_place && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {chart.birth_place.split(',')[0]}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Dibuat: {formatDate(chart.created_at)}
                          </p>
                        </div>
                        <Button onClick={() => handleViewChart(chart)} className="fire-glow">
                          Lihat Chart
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              {orders.length === 0 ? (
                <div className="glass-card rounded-xl p-8 text-center animate-fade-up">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Kamu belum membeli laporan
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/reports">
                      Lihat Produk Kami
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 animate-fade-up">
                  {orders.map((order) => (
                    <div key={order.id} className="glass-card rounded-xl p-6 border border-border">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left: Order Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground text-lg">
                              {order.product_name || 'Laporan Human Design'}
                            </h3>
                            {getStatusBadge(order.status, order.created_at)}
                          </div>
                          <p className="text-sm text-muted-foreground">Order Ref: {order.reference_id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.paid_at
                              ? `Dibayar pada: ${new Date(order.paid_at).toLocaleString()}`
                              : `Dipesan pada: ${new Date(order.created_at).toLocaleString()}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* PENDING & NOT EXPIRED: Show Pay Button */}
                          {order.status === 'PENDING' && order.payment_url && (new Date().getTime() - new Date(order.created_at).getTime() <= 24 * 60 * 60 * 1000) && (
                            <Button asChild className="fire-glow" size="sm">
                              <a href={order.payment_url} target="_blank" rel="noopener noreferrer">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Bayar Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                          )}

                          {/* PAID & NO REPORT: Show Processing */}
                          {order.status === 'PAID' && !order.report_url && (
                            <div className="bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Report sedang disusun oleh tim...
                            </div>
                          )}

                          {/* PAID & REPORT READY: Show Download */}
                          {order.status === 'PAID' && order.report_url && (
                            <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/10">
                              <a href={order.report_url} target="_blank" rel="noopener noreferrer">
                                <FileText className="w-4 h-4 mr-2" />
                                Download PDF
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="affiliate">
              <AffiliateDashboard userId={user.id} email={user.email || ''} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
