import { useState, useEffect } from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { User, FileText, Clock, ArrowRight, LogIn, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { ChartResult } from '@/components/ChartResult';
import { BirthDataForChart } from '@/pages/Index';

interface SavedChart {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string | null;
  birth_place: string | null;
  chart_data: any;
  created_at: string;
}

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [selectedChart, setSelectedChart] = useState<SavedChart | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  /* Purchased Reports */
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Auth form state
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Fetch charts when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchSavedCharts();
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.user) {
        fetchSavedCharts();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSavedCharts = async () => {
    const { data, error } = await supabase
      .from('saved_charts')
      .select('id, name, birth_date, birth_time, birth_place, chart_data, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching charts:', error);
    } else {
      setSavedCharts(data || []);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Email atau password salah');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Berhasil masuk!');
    }

    setAuthLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      setAuthLoading(false);
      return;
    }

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        toast.error('Email sudah terdaftar. Silakan login.');
        setIsLoginMode(true);
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Akun berhasil dibuat! Silakan cek email untuk verifikasi.');
    }

    setAuthLoading(false);
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
      year,
      month,
      day,
      hour,
      minute,
      place: chart.birth_place || '',
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
      <div className="min-h-screen bg-background">
        <MainNavbar />

        <main className="pt-24 pb-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="glass-card rounded-2xl p-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-10 h-10 text-accent" />
              </div>

              <h1 className="text-2xl font-bold text-foreground text-center mb-2">
                {isLoginMode ? 'Masuk ke Akun' : 'Buat Akun Baru'}
              </h1>
              <p className="text-muted-foreground text-center mb-8">
                {isLoginMode
                  ? 'Masuk untuk melihat chart tersimpan dan riwayat laporan.'
                  : 'Daftar untuk menyimpan chart dan akses kapan saja.'}
              </p>

              <form onSubmit={isLoginMode ? handleLogin : handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="auth-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="auth-email"
                      type="email"
                      placeholder="contoh@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auth-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full fire-glow h-12 rounded-xl"
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isLoginMode ? 'Masuk...' : 'Mendaftar...'}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      {isLoginMode ? 'Masuk' : 'Daftar'}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-accent hover:underline text-sm"
                >
                  {isLoginMode
                    ? 'Belum punya akun? Daftar'
                    : 'Sudah punya akun? Masuk'}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Belum punya chart?
                </p>
                <Link
                  to="/"
                  className="text-accent hover:underline inline-flex items-center gap-1 justify-center w-full"
                >
                  Buat Chart Gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
          />
        </main>

        <Footer />
      </div>
    );
  }



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">Lunas</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">Menunggu Pembayaran</span>;
      case 'FAILED':
        return <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded-full">Gagal</span>;
      case 'EXPIRED':
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">Kedaluwarsa</span>;
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
                <h1 className="text-2xl font-bold text-foreground">Akun Saya</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Keluar
            </Button>
          </div>

          {/* Saved Charts */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Chart Tersimpan
            </h2>

            {savedCharts.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Anda belum memiliki chart tersimpan
                </p>
                <Button asChild>
                  <Link to="/">
                    Buat Chart Pertama Anda
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
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
          </section>

          {/* Purchased Reports */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Laporan Saya
            </h2>
            {orders.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Anda belum membeli laporan
                </p>
                <Button variant="outline" asChild>
                  <Link to="/reports">
                    Lihat Produk Kami
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="glass-card rounded-xl p-6 border border-border">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                      {/* Left: Order Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-lg">
                            {order.product_name || 'Laporan Human Design'}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">Order Ref: {order.reference_id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.paid_at
                            ? `Dibayar pada: ${new Date(order.paid_at).toLocaleString()}`
                            : `Dipesan pada: ${new Date(order.created_at).toLocaleString()}`}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3">
                        {/* PENDING: Show Pay Button */}
                        {order.status === 'PENDING' && order.payment_url && (
                          <Button asChild className="fire-glow">
                            <a href={order.payment_url} target="_blank" rel="noopener noreferrer">
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
