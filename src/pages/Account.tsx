import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { User, FileText, Clock, ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Account = () => {
  // TODO: Implement authentication check
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <MainNavbar />
        
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="glass-card rounded-2xl p-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-10 h-10 text-accent" />
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Masuk ke Akun Anda
              </h1>
              <p className="text-muted-foreground mb-8">
                Simpan chart Human Design Anda dan akses riwayat laporan kapan saja.
              </p>

              <div className="space-y-4">
                <Button className="w-full fire-glow" size="lg">
                  <LogIn className="w-5 h-5 mr-2" />
                  Masuk
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Daftar Akun Baru
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Belum punya chart?
                </p>
                <Link 
                  to="/" 
                  className="text-accent hover:underline inline-flex items-center gap-1"
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

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Account</h1>
              <p className="text-muted-foreground">Kelola chart dan laporan Anda</p>
            </div>
          </div>

          {/* Saved Charts */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              My Saved Charts
            </h2>
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
          </section>

          {/* Purchased Reports */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              My Reports
            </h2>
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
