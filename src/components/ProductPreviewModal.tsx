import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ShoppingCart, Loader2, User as UserIcon, Mail, Phone, AlertCircle, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ebookCover from "@/assets/cover_ebook_sample.png";

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  chartId?: string;
  userId?: string;
}

export const ProductPreviewModal = ({
  isOpen,
  onClose,
  userName,
  userEmail = '',
  userPhone = '',
  chartId,
  userId
}: ProductPreviewModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);

  // Billing state
  const [billingName, setBillingName] = useState(userName);
  const [billingEmail, setBillingEmail] = useState(userEmail);
  const [billingPhone, setBillingPhone] = useState(userPhone);

  // Update state when props change
  useEffect(() => {
    if (isOpen) {
      setBillingName(userName);
      setBillingEmail(userEmail);
      setBillingPhone(userPhone);
    }
  }, [isOpen, userName, userEmail, userPhone]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Capitalize first letter of each word
    const capitalized = value.replace(/\b\w/g, (char) => char.toUpperCase());
    setBillingName(capitalized);
  };

  const handleBuy = async () => {
    if (!billingName || !billingEmail || !billingPhone) {
      toast.error('Mohon lengkapi data pemesan (Nama, Email, WhatsApp)');
      return;
    }

    // Check for duplicate purchase if chartId is present
    if (chartId) {
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('status', 'PAID')
        .contains('metadata', { chart_ids: [chartId] })
        .maybeSingle();

      if (existingOrder) {
        setShowDuplicateAlert(true);
        return;
      }
    }

    setIsLoading(true);

    try {
      // Generate Reference ID uniquely
      const referenceId = `TB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const chartIds = chartId ? [chartId] : [];

      // 1. Save order to database first
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId || null,
          reference_id: referenceId,
          customer_name: billingName,
          customer_email: billingEmail,
          customer_phone: billingPhone,
          product_name: `Full Report Human Design: ${userName}`,
          amount: 199000,
          status: 'PENDING',
          metadata: { chart_ids: chartIds }
        });

      if (orderError) {
        console.error('Order creation error:', orderError);
        toast.error('Gagal membuat pesanan: ' + orderError.message);
        setIsLoading(false);
        return;
      }

      // 2. Get Midtrans Snap Token
      const { data, error } = await supabase.functions.invoke('midtrans-checkout', {
        body: {
          referenceId: referenceId,
          customerName: billingName,
          customerEmail: billingEmail,
          customerPhone: billingPhone,
          amount: 199000,
          productName: `Full Report Human Design: ${userName}`,
          chartIds: chartIds
        }
      });

      if (error) {
        console.error('Checkout error:', error);
        toast.error('Gagal memproses pembayaran. Silakan coba lagi.');
        return;
      }

      if (data?.success && data?.token) {
        // Use Midtrans Snap popup
        // @ts-ignore - snap is loaded from external script
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            console.log('Payment success:', result);
            toast.success('Pembayaran berhasil! Laporan akan dikirim dalam 24 jam.');
            onClose();
            window.location.href = `/payment-result?ref=${referenceId}`;
          },
          onPending: function (result: any) {
            console.log('Payment pending:', result);
            toast.info('Pembayaran pending. Silakan selesaikan pembayaran.');
            onClose();
            window.location.href = `/payment-result?ref=${referenceId}`;
          },
          onError: function (result: any) {
            console.error('Payment error:', result);
            toast.error('Pembayaran gagal. Silakan coba lagi.');
          },
          onClose: function () {
            console.log('Snap popup closed');
            setIsLoading(false);
          }
        });
      } else {
        toast.error(data?.error || 'Gagal mendapatkan token pembayaran');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

              {/* Billing Inputs */}
              <div className="space-y-3 border-t border-border pt-4">
                <h4 className="font-semibold text-foreground text-sm">Data Pemesan (Wajib Diisi):</h4>

                <div className="space-y-2">
                  <Label htmlFor="billing-name" className="text-xs">Nama Lengkap</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="billing-name"
                      value={billingName}
                      onChange={handleNameChange}
                      placeholder="Nama Lengkap"
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-email" className="text-xs">Email (untuk pengiriman file)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="billing-email"
                      type="email"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-phone" className="text-xs">WhatsApp (untuk konfirmasi)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="billing-phone"
                      type="tel"
                      value={billingPhone}
                      onChange={(e) => setBillingPhone(e.target.value)}
                      placeholder="+62812345678"
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-4 border border-primary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground line-through">Rp 500.000</span>
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">HEMAT 60%</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">Rp 199.000</span>
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

              <div className="text-center space-y-2 pt-2">
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Garansi Uang Kembali
                  </span>
                  <span>•</span>
                  <span>1500+ Chart Dibuat</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Pembayaran Aman via Midtrans (QRIS, VA, E-Wallet)
                </p>
                <p className="text-[10px] text-muted-foreground">
                  ⚡ Laporan dikirim dalam 24 jam ke email Anda
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Duplicate Alert Dialog */}
      <Dialog open={showDuplicateAlert} onOpenChange={setShowDuplicateAlert}>
        <DialogContent className="max-w-md bg-card border-destructive/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-6 h-6" />
              Chart Sudah Dibeli
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground">
              Chart ini sudah pernah dibeli dan dibayar sebelumnya (status LUNAS).
            </p>
            <p className="text-muted-foreground text-sm">
              Silakan generate chart baru atau cek menu "Laporan Saya" untuk melihat chart yang sudah Anda beli.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setShowDuplicateAlert(false)}>
                Mengerti
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
