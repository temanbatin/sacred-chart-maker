import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { CheckCircle2, XCircle, Clock, ArrowRight, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaymentStatus = 'success' | 'pending' | 'failed' | 'unknown';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>('unknown');
  const [referenceId, setReferenceId] = useState<string | null>(null);

  useEffect(() => {
    // Get status from URL params (iPaymu returns status in URL)
    const statusParam = searchParams.get('status');
    const trxId = searchParams.get('trx_id');
    const refId = searchParams.get('ref') || searchParams.get('reference_id');
    
    setReferenceId(refId || trxId || null);

    // iPaymu status codes: 1 = success, 0 = pending, -1 = failed
    if (statusParam === '1' || statusParam === 'berhasil' || statusParam === 'success') {
      setStatus('success');
    } else if (statusParam === '0' || statusParam === 'pending') {
      setStatus('pending');
    } else if (statusParam === '-1' || statusParam === 'gagal' || statusParam === 'failed') {
      setStatus('failed');
    } else {
      // Default to pending if no status (user might have returned without completing)
      setStatus('pending');
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center animate-fade-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pembayaran Berhasil! 🎉
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              Terima kasih atas pembelian Anda. Laporan Human Design Anda sedang diproses dan akan dikirim ke email Anda.
            </p>
            {referenceId && (
              <div className="bg-secondary/30 rounded-lg p-4 mb-8 max-w-sm mx-auto">
                <p className="text-sm text-muted-foreground">ID Transaksi:</p>
                <p className="text-lg font-mono font-semibold text-accent">{referenceId}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="fire-glow">
                <Link to="/account">
                  <FileText className="w-4 h-4 mr-2" />
                  Lihat Laporan Saya
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center animate-fade-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Menunggu Pembayaran
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              Pembayaran Anda sedang diproses. Silakan selesaikan pembayaran sesuai instruksi yang diberikan.
            </p>
            {referenceId && (
              <div className="bg-secondary/30 rounded-lg p-4 mb-8 max-w-sm mx-auto">
                <p className="text-sm text-muted-foreground">ID Referensi:</p>
                <p className="text-lg font-mono font-semibold text-accent">{referenceId}</p>
              </div>
            )}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-8 max-w-lg mx-auto">
              <h3 className="font-semibold text-foreground mb-2">Langkah Selanjutnya:</h3>
              <ul className="text-left text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-primary" />
                  Selesaikan pembayaran sebelum batas waktu
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-primary" />
                  Anda akan menerima email konfirmasi setelah pembayaran berhasil
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-1 text-primary" />
                  Laporan akan tersedia di akun Anda
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="fire-glow">
                <Link to="/reports">
                  <FileText className="w-4 h-4 mr-2" />
                  Kembali ke Reports
                </Link>
              </Button>
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
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pembayaran Gagal
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
              Maaf, pembayaran Anda tidak berhasil. Silakan coba lagi atau gunakan metode pembayaran lain.
            </p>
            {referenceId && (
              <div className="bg-secondary/30 rounded-lg p-4 mb-8 max-w-sm mx-auto">
                <p className="text-sm text-muted-foreground">ID Referensi:</p>
                <p className="text-lg font-mono font-semibold text-muted-foreground">{referenceId}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="fire-glow">
                <Link to="/reports">
                  <FileText className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/hubungi-kami">
                  Hubungi Kami
                </Link>
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center animate-fade-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Clock className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Status Pembayaran
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Kami sedang memproses status pembayaran Anda. Silakan cek email Anda untuk informasi lebih lanjut.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="fire-glow">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
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
