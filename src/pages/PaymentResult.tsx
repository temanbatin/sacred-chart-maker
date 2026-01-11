import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { CheckCircle2, XCircle, Clock, Home, Mail, UserPlus, Star } from 'lucide-react';
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

// Fancy Animated Progress Step Component
const ProgressStep = ({
  step,
  title,
  isActive,
  isCompleted,
  isLast
}: {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}) => (
  <div className="flex items-center">
    <div className="flex flex-col items-center relative">
      {/* Pulse ring for active step */}
      {isActive && !isCompleted && (
        <div className="absolute w-12 h-12 rounded-full bg-amber-500/30 animate-ping" />
      )}

      {/* Step circle */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all duration-500
        ${isCompleted
          ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/30'
          : isActive
            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/30 animate-pulse'
            : 'bg-secondary/50 text-muted-foreground border border-secondary'
        }
      `}>
        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step}
      </div>

      {/* Step title */}
      <p className={`text-xs mt-2 text-center max-w-[70px] font-medium transition-colors duration-300 ${isCompleted ? 'text-green-400' : isActive ? 'text-amber-400' : 'text-muted-foreground'
        }`}>
        {title}
      </p>
    </div>

    {/* Connecting line with animation */}
    {!isLast && (
      <div className="w-6 md:w-12 h-1 mx-1 rounded-full overflow-hidden bg-secondary/30">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isCompleted
            ? 'w-full bg-gradient-to-r from-green-400 to-green-500'
            : isActive
              ? 'w-1/2 bg-gradient-to-r from-amber-400 to-amber-500 animate-pulse'
              : 'w-0'
            }`}
        />
      </div>
    )}
  </div>
);

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>('unknown');
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const { session } = useAuthSession();

  useEffect(() => {
    const fetchOrderStatus = async () => {
      const refId = searchParams.get('ref') || searchParams.get('reference_id');
      setReferenceId(refId);

      if (refId) {
        // Fetch actual order status from database
        const { data, error } = await supabase
          .from('orders')
          .select('customer_email, customer_name, status, report_url')
          .eq('reference_id', refId)
          .single();

        if (data && !error) {
          setOrderData(data as OrderData);
          if (data.status === 'PAID' && data.report_url) {
            setStatus('success'); // Report sent
          } else if (data.status === 'PAID') {
            setStatus('success'); // Paid, processing
          } else if (data.status === 'FAILED') {
            setStatus('failed');
          } else {
            setStatus('pending');
          }
        } else {
          // Fallback to URL params
          const statusParam = searchParams.get('status');
          if (statusParam === '1' || statusParam === 'success') {
            setStatus('success');
          } else if (statusParam === '-1' || statusParam === 'failed') {
            setStatus('failed');
          } else {
            setStatus('pending');
          }
        }
      } else {
        setStatus('pending');
      }
      setLoading(false);
    };

    fetchOrderStatus();
  }, [searchParams]);

  // Determine progress based on status
  const getProgress = () => {
    if (status === 'success' && orderData?.report_url) {
      return 3; // Laporan terkirim
    } else if (status === 'success') {
      return 2; // Sedang disusun
    } else if (status === 'pending') {
      return 0; // Menunggu pembayaran
    }
    return 0;
  };

  const progress = getProgress();

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
              Laporan akan dikirim ke <span className="text-accent font-medium">{orderData?.customer_email || 'email kamu'}</span> dalam 24 jam.
            </p>

            {/* Progress Tracker */}
            <div className="bg-secondary/30 rounded-2xl p-6 mb-8 max-w-xl mx-auto">
              <h3 className="font-semibold text-foreground mb-6">Status Pesanan</h3>
              <div className="flex justify-center items-start">
                <ProgressStep step={1} title="Pembayaran Diterima" isActive={progress >= 1} isCompleted={progress >= 1} isLast={false} />
                <ProgressStep step={2} title="Laporan Disusun" isActive={progress >= 2} isCompleted={progress >= 3} isLast={false} />
                <ProgressStep step={3} title="Terkirim" isActive={progress >= 3} isCompleted={progress >= 3} isLast={false} />
                <ProgressStep step={4} title="Review & Diskon" isActive={progress >= 4} isCompleted={false} isLast={true} />
              </div>
            </div>

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
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Selesaikan pembayaran sebelum batas waktu (24 jam).
            </p>

            {referenceId && (
              <div className="bg-secondary/30 rounded-lg p-4 mb-6 max-w-xs mx-auto">
                <p className="text-sm text-muted-foreground">ID Pesanan:</p>
                <p className="text-lg font-mono font-semibold text-accent">{referenceId}</p>
              </div>
            )}

            {/* Progress Tracker - Step 0 */}
            <div className="bg-secondary/30 rounded-2xl p-6 mb-8 max-w-xl mx-auto">
              <div className="flex justify-center items-start opacity-50">
                <ProgressStep step={1} title="Pembayaran Diterima" isActive={false} isCompleted={false} isLast={false} />
                <ProgressStep step={2} title="Laporan Disusun" isActive={false} isCompleted={false} isLast={false} />
                <ProgressStep step={3} title="Terkirim" isActive={false} isCompleted={false} isLast={false} />
                <ProgressStep step={4} title="Review & Diskon" isActive={false} isCompleted={false} isLast={true} />
              </div>
            </div>

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
