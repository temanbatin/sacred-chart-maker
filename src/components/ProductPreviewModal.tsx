import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import ebookCover from "@/assets/cover_ebook_sample.png";

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const ProductPreviewModal = ({ isOpen, onClose, userName }: ProductPreviewModalProps) => {
  const handleBuy = () => {
    // Redirect to DOKU payment page
    window.open("https://dfrfrw.dfrfrw.dfrfrwrf.drf", "_blank");
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
              size="lg"
              className="w-full fire-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-lg py-6"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Beli Sekarang
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
