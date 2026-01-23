import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { CheckCircle2, XCircle, Clock, Home, Mail, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSession } from '@/hooks/useAuthSession';

type PaymentStatus = 'success' | 'pending' | 'failed' | 'unknown';

interface OrderData {
  customer_email?: string;
  customer_name?: string;
  status?: string;
  report_url?: string;
}

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>('unknown');
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const { session } = useAuthSession();

  // Polling refs
  const pollCountRef = useRef(0);
  const maxPolls = 20; // 20 * 3s = 60s max polling
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const refId = searchParams.get('ref') || searchParams.get('reference_id');
    setReferenceId(refId);

    const checkStatus = async () => {
      if (!refId) {
        setStatus('pending');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('customer_email, customer_name, status, report_url')
        .eq('reference_id', refId)
        .single();

      if (data && !error) {
        setOrderData(data as OrderData);

        if (data.status === 'PAID') {
          setStatus('success');
          // Start tracking purchase if needed
          const trackKey = `tracked_purchase_${refId}`;
          if (window.fbq && !sessionStorage.getItem(trackKey)) {
            window.fbq('track', 'Purchase', { value: 199000, currency: 'IDR' });
            sessionStorage.setItem(trackKey, 'true');
          }
          // Stop polling if successful
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        } else if (data.status === 'FAILED') {
          setStatus('failed');
          // Stop polling if failed
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        } else {
          // Still pending
          setStatus('pending');
        }
      } else {
        // Fallback or error fetching
        const statusParam = searchParams.get('status');
        if (statusParam === '1' || statusParam === 'success') {
          setStatus('success');
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        } else if (statusParam === '-1' || statusParam === 'failed') {
          setStatus('failed');
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        } else {
          setStatus('pending');
        }
      }
      setLoading(false);
    };

    // Initial check
    checkStatus();

    // Start polling
    pollIntervalRef.current = setInterval(() => {
      pollCountRef.current += 1;
      if (pollCountRef.current >= maxPolls) {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      } else {
        checkStatus();
      }
    }, 3000); // Poll every 3 seconds

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [searchParams]);


  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat status pesanan...</p>
        </div>
      );
    }

    switch (status) {
      case 'success':
        return (
          <div className="text-center animate-fade-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pembayaran Berhasil! 🎉
            </h1>
            <p className="text-lg text-muted-foreground mb-2 max-w-md mx-auto">
              Terima kasih, <span className="text-foreground font-medium">{orderData?.customer_name || 'Kamu'}</span>!
            </p>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Laporan akan dikirim ke <span className="text-accent font-medium">{orderData?.customer_email || 'email kamu'}</span> secara instan (dalam hitungan menit).
            </p>

            {/* REMOVED PROGRESS TRACKER HERE */}

            {referenceId && (
              <div className="bg-secondary/20 rounded-lg p-3 mb-6 max-w-xs mx-auto">
                <p className="text-xs text-muted-foreground">ID Pesanan:</p>
                <p className="text-sm font-mono text-accent">{referenceId}</p>
              </div>
            )}

            {/* CTA: Create Account - Check using session from useAuthSession */}
            {!session && (
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <UserPlus className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Buat Akun untuk Track Pesanan</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Dengan akun, kamu bisa pantau status laporan dan akses semua chart yang pernah kamu buat.
                </p>
                <Button asChild className="fire-glow w-full">
                  <Link to={`/account?email=${encodeURIComponent(orderData?.customer_email || '')}&ref=${referenceId || ''}`}>
                    Buat Akun Gratis
                  </Link>
                </Button>
              </div>
            )}

            <Button asChild variant="outline" size="lg">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center animate-fade-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Menunggu Pembayaran
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-md mx-auto">
              Selesaikan pembayaran sebelum batas waktu (24 jam).
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Mengecek status pembayaran otomatis...
            </p>

            {referenceId && (
              <div className="bg-secondary/30 rounded-lg p-4 mb-6 max-w-xs mx-auto">
                <p className="text-sm text-muted-foreground">ID Pesanan:</p>
                <p className="text-lg font-mono font-semibold text-accent">{referenceId}</p>
              </div>
            )}

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 max-w-md mx-auto">
              <Mail className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Setelah bayar, laporan dikirim ke email yang kamu masukkan saat checkout.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center animate-fade-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pembayaran Gagal
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              Maaf, pembayaran tidak berhasil. Silakan coba lagi.
            </p>
            {referenceId && (
              <div className="bg-secondary/30 rounded-lg p-4 mb-8 max-w-sm mx-auto">
                <p className="text-sm text-muted-foreground">ID Referensi:</p>
                <p className="text-lg font-mono text-muted-foreground">{referenceId}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="fire-glow">
                <Link to="/">
                  Coba Lagi
                </Link>
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center animate-fade-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Clock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Status Pembayaran
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Cek email kamu untuk informasi lebih lanjut.
            </p>
            <Button asChild size="lg" className="fire-glow">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto min-h-[60vh] flex items-center justify-center">
          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentResult;
