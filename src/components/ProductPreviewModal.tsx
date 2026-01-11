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
import { CheckCircle2, ShoppingCart, Loader2, User as UserIcon, Mail, Phone, AlertCircle, Shield, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ebookCover from "@/assets/cover_ebook_sample.jpg";
import reportSS1 from "@/assets/Report SS.jpg";
import reportSS2 from "@/assets/Report SS 2.jpg";
import reportSS3 from "@/assets/Report SS 3.jpg";
import { PRICING_CONFIG, formatPrice } from "@/config/pricing";

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  chartId?: string;
  userId?: string;
  birthData?: any;
  chartData?: any;
}

export const ProductPreviewModal = ({
  isOpen,
  onClose,
  userName,
  userEmail = '',
  userPhone = '',
  chartId,
  userId,
  birthData,
  chartData
}: ProductPreviewModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);


  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  const checkCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsCheckingCoupon(true);
    try {
      // @ts-ignore
      const { data, error } = await supabase.rpc('check_coupon_validity', { coupon_code: couponCode.trim() });

      if (error) throw error;

      const result = data as any;

      if (result.valid) {
        setAppliedCoupon(result);
        toast.success(result.message);
      } else {
        setAppliedCoupon(null);
        toast.error(result.message);
      }
    } catch (err: any) {
      console.error('Coupon check error:', err);
      toast.error('Gagal mengecek kupon');
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const handleRedeemFree = async () => {
    setIsLoading(true);
    try {
      // ... Reuse same pre-save chart logic as handleBuy if needed ...
      // For brevity, assuming chartId is handled or we use the unified flow

      // 0. Handle Buyer Guest (Copy-Paste from handleBuy or extract to function in refactor)
      let finalChartIds = chartId ? [chartId] : [];
      if (!chartId && birthData && chartData) {
        const newChartId = crypto.randomUUID();
        const { error: saveError } = await supabase.from('saved_charts').insert({
          id: newChartId,
          user_id: userId || null,
          name: birthData.name,
          birth_date: `${birthData.year}-${String(birthData.month).padStart(2, '0')}-${String(birthData.day).padStart(2, '0')}`,
          birth_time: `${String(birthData.hour).padStart(2, '0')}:${String(birthData.minute).padStart(2, '0')}:00`,
          birth_place: birthData.place,
          chart_data: chartData,
        });
        if (!saveError) finalChartIds = [newChartId];
      }

      const referenceId = `TB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const { data, error } = await supabase.functions.invoke('redeem-free-order', {
        body: {
          couponCode: couponCode.trim(),
          referenceId,
          customerName: billingName,
          customerEmail: billingEmail,
          customerPhone: billingPhone,
          productName: `Full Report Human Design: ${userName}`,
          chartIds: finalChartIds,
          birthData,
          userId
        }
      });

      if (error) throw error;

      if (data?.success && data?.redirect_url) {
        toast.success('Kupon berhasil digunakan! Mengarahkan...');
        window.location.href = data.redirect_url;
      } else {
        throw new Error(data?.error || 'Redeem gagal');
      }

    } catch (err: any) {
      console.error('Redeem error:', err);
      toast.error(err.message || 'Gagal klaim kupon');
    } finally {
      setIsLoading(false);
    }
  };

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

      // Track Initiate Checkout
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout');
      }
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

    // Check for duplicate purchase (Prevent re-ordering same chart)
    // We check based on CONTENT (birthData) + Identity (UserId or Email)
    if (birthData) {
      let query = supabase
        .from('orders')
        .select('id')
        .eq('status', 'PAID')
        .contains('metadata', {
          birth_data: {
            name: birthData.name,
            year: birthData.year,
            month: birthData.month,
            day: birthData.day,
            hour: birthData.hour,
            minute: birthData.minute
            // We exclude 'place' and 'gender' to be more lenient on minor variations, 
            // or include them if strict required. Name+Time is usually unique enough.
          }
        });

      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.eq('customer_email', billingEmail);
      }

      const { data: existingOrder } = await query.maybeSingle();

      if (existingOrder) {
        setShowDuplicateAlert(true);
        setIsLoading(false); // Stop loading!
        return;
      }
    }

    setIsLoading(true);

    try {
      // 0. Handle Buyer Guest: If no chartId exists (guest user), save chart now to get an ID
      let finalChartIds = chartId ? [chartId] : [];

      if (!chartId && birthData && chartData) {
        try {
          const birthDateStr = `${birthData.year}-${String(birthData.month).padStart(2, '0')}-${String(birthData.day).padStart(2, '0')}`;
          const birthTimeStr = `${String(birthData.hour).padStart(2, '0')}:${String(birthData.minute).padStart(2, '0')}:00`;

          // Generate ID client-side to avoid "select" permission issues from strict RLS
          const newChartId = crypto.randomUUID();

          // Insert with the pre-generated ID
          const { error: saveError } = await supabase
            .from('saved_charts')
            .insert({
              id: newChartId,
              user_id: userId || null, // Allow null for guests
              name: birthData.name,
              birth_date: birthDateStr,
              birth_time: birthTimeStr,
              birth_place: birthData.place,
              chart_data: chartData,
            });

          if (saveError) {
            console.error('Auto-save chart error:', saveError);
            // Continue without ID if save fails (will use birthData in metadata)
          } else {
            // Success - use the pre-generated ID
            finalChartIds = [newChartId];
          }
        } catch (err) {
          console.error('Auto-save chart exception:', err);
        }
      }

      // Generate Reference ID uniquely
      const referenceId = `TB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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
          amount: PRICING_CONFIG.REPORT_PRICE,
          status: 'PENDING',
          metadata: {
            chart_ids: finalChartIds,
            birth_data: birthData,
            coupon_code: couponCode // Save coupon code in metadata for N8N tracking
          }
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
          amount: PRICING_CONFIG.REPORT_PRICE,
          productName: `Full Report Human Design: ${userName}`,
          chartIds: finalChartIds,
          birthData: birthData,
          couponCode: couponCode // Pass coupon code to backend
        }
      });

      if (error) {
        console.error('Checkout error:', error);
        toast.error('Gagal memproses pembayaran. Silakan coba lagi.');
        return;
      }

      if (data?.success && data?.redirect_url) {
        // Save referenceId to sessionStorage for callback persistence
        sessionStorage.setItem('paymentRefId', referenceId);

        // Close our modal
        onClose();

        toast.success('Mengarahkan ke halaman pembayaran...');

        // Use Redirect Mode (More reliable for Production)
        window.location.href = data.redirect_url;
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl text-center text-foreground">
              Laporan Analisis Mendalam Human Design
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mt-4">
            {/* Product Cover Image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <img
                  src={ebookCover}
                  alt="Laporan Analisis Mendalam Human Design"
                  className="w-48 sm:w-56 md:w-64 h-auto rounded-lg shadow-xl"
                />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                  100+ Halaman
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div className="bg-secondary/30 rounded-lg p-3 sm:p-4 border border-border">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Disusun Khusus Untuk:</p>
                <p className="text-base sm:text-lg font-semibold text-accent">{userName}</p>
              </div>

              {/* ... Features List (Keep existing) ... */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Apa yang kamu dapatkan:</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground"><span className="text-foreground font-medium">Analisis Mendalam</span> tentang Tipe, Strategi, Otoritas, Profil</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground"><span className="text-foreground font-medium">Penjelasan Detail Incarnation Cross</span> (Misi Hidup)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground"><span className="text-foreground font-medium">Penjelasan detail Gate & Center</span></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground"><span className="text-foreground font-medium">Panduan Strategi Karir & Relasi</span></p>
                  </div>
                </div>
              </div>

              {/* Billing Inputs */}
              <div className="space-y-2 sm:space-y-3 border-t border-border pt-3 sm:pt-4">
                <h4 className="font-semibold text-foreground text-xs sm:text-sm">Data Pemesan (Wajib Diisi):</h4>
                <div className="space-y-2">
                  <Label htmlFor="billing-name" className="text-xs">Nama Lengkap</Label>
                  <Input id="billing-name" value={billingName} onChange={handleNameChange} placeholder="Nama Lengkap" className="h-9 sm:h-10 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-email" className="text-xs">Email</Label>
                  <Input id="billing-email" type="email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} placeholder="email@contoh.com" className="h-9 sm:h-10 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-phone" className="text-xs">WhatsApp</Label>
                  <Input id="billing-phone" type="tel" value={billingPhone} onChange={(e) => setBillingPhone(e.target.value)} placeholder="+628..." className="h-9 sm:h-10 text-sm" />
                </div>
              </div>

              {/* Coupon Input */}
              <div className="space-y-2 sm:space-y-3 border-t border-border pt-3 sm:pt-4">
                <Label className="text-xs font-semibold">Punya kode kupon?</Label>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Masukkan kode"
                    className="h-9 sm:h-10 text-sm uppercase"
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <Button variant="outline" size="sm" onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-destructive border-destructive hover:bg-destructive/10 text-xs sm:text-sm whitespace-nowrap">
                      Hapus
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={checkCoupon}
                      disabled={isCheckingCoupon || !couponCode}
                      className="text-xs sm:text-sm whitespace-nowrap"
                    >
                      {isCheckingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek'}
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Kupon berhasil dipasang!
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-secondary/30 rounded-xl p-4 border border-border space-y-3">
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Ringkasan Pesanan
                </h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Produk</span>
                    <span className="text-foreground">Laporan Human Design Lengkap</span>
                  </div>

                  {appliedCoupon?.discount_type === 'full_free' ? (
                    <div className="flex justify-between items-baseline border-t border-border pt-2 mt-2">
                      <span className="text-muted-foreground">Total</span>
                      <div className="text-right">
                        <span className="line-through text-muted-foreground text-sm mr-2">{formatPrice(PRICING_CONFIG.REPORT_PRICE)}</span>
                        <span className="text-xl font-bold text-green-500">GRATIS</span>
                      </div>
                    </div>
                  ) : appliedCoupon?.discount_type === 'percentage' ? (
                    <div className="flex justify-between items-baseline border-t border-border pt-2 mt-2">
                      <span className="text-muted-foreground">
                        <span className="line-through mr-2">{formatPrice(PRICING_CONFIG.REPORT_PRICE)}</span>
                        <span className="bg-green-500/20 text-green-400 text-xs px-1.5 py-0.5 rounded">-{Math.round(Number(appliedCoupon.discount_value))}%</span>
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(Math.round(PRICING_CONFIG.REPORT_PRICE * (1 - Number(appliedCoupon.discount_value) / 100)))}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-baseline border-t border-border pt-2 mt-2">
                      <span className="text-muted-foreground">
                        <span className="line-through mr-2">{formatPrice(PRICING_CONFIG.ORIGINAL_PRICE)}</span>
                        <span className="bg-green-500/20 text-green-400 text-xs px-1.5 py-0.5 rounded">-{Math.round(((PRICING_CONFIG.ORIGINAL_PRICE - PRICING_CONFIG.REPORT_PRICE) / PRICING_CONFIG.ORIGINAL_PRICE) * 100)}%</span>
                      </span>
                      <span className="text-2xl font-bold text-primary">{formatPrice(PRICING_CONFIG.REPORT_PRICE)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              {appliedCoupon?.discount_type === 'full_free' ? (
                <Button
                  onClick={handleRedeemFree}
                  disabled={isLoading || !billingName || !billingEmail}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 shadow-lg shadow-green-500/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      <span className="whitespace-nowrap">Memproses Klaim...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="whitespace-nowrap">Klaim Report Gratis</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleBuy}
                  disabled={isLoading || !billingName || !billingEmail}
                  size="lg"
                  className="w-full fire-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      <span className="whitespace-nowrap">Memproses...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="whitespace-nowrap">Bayar {appliedCoupon?.discount_type === 'percentage'
                        ? formatPrice(Math.round(PRICING_CONFIG.REPORT_PRICE * (1 - Number(appliedCoupon.discount_value) / 100)))
                        : formatPrice(PRICING_CONFIG.REPORT_PRICE)}</span>
                    </>
                  )}
                </Button>
              )}



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
