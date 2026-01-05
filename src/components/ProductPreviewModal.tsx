import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingCart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ebookCover from "@/assets/cover_ebook_sample.png";

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  userPhone?: string;
}

// Declare DOKU checkout function
declare global {
  interface Window {
    loadJokulCheckout?: (url: string) => void;
  }
}

export const ProductPreviewModal = ({ 
  isOpen, 
  onClose, 
  userName,
  userEmail = '',
  userPhone = ''
}: ProductPreviewModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('doku-checkout', {
        body: {
          customerName: userName,
          customerEmail: userEmail,
          customerPhone: userPhone,
          amount: 149000,
          productName: 'Laporan Analisis Mendalam Human Design'
        }
      });

      if (error) {
        console.error('Checkout error:', error);
        toast.error('Gagal memproses pembayaran. Silakan coba lagi.');
        return;
      }

      if (data?.success && data?.paymentUrl) {
        // Try to use DOKU modal if script is loaded
        if (window.loadJokulCheckout) {
          window.loadJokulCheckout(data.paymentUrl);
        } else {
          // Fallback to redirect
          window.location.href = data.paymentUrl;
        }
        onClose();
      } else {
        toast.error(data?.error || 'Gagal mendapatkan link pembayaran');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-foreground">
            Laporan Analisis Mendalam Human Design
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Product Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative">
              <img
                src={ebookCover}
                alt="Laporan Analisis Mendalam Human Design"
                className="w-64 h-auto rounded-lg shadow-xl"
              />
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                -90%
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-4">
            <div className="bg-secondary/30 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Disusun Khusus Untuk:</p>
              <p className="text-lg font-semibold text-accent">{userName}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Apa yang kamu dapatkan:</h4>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Analisis Mendalam</span> tentang Tipe, Strategi, Otoritas, Profil
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Penjelasan Detail Incarnation Cross</span> (Misi Hidup)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Penjelasan detail Gate & Center</span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Panduan Strategi Karir & Relasi</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 border border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground line-through">Rp 1.550.000</span>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">HEMAT 90%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">Rp 149.000</span>
                <span className="text-sm text-muted-foreground">sekali bayar</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleBuy}
              disabled={isLoading}
              size="lg"
              className="w-full fire-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-lg py-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Beli Sekarang
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Pembayaran aman via DOKU • Akses instan setelah pembayaran
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
