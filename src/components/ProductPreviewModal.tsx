import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ShoppingCart, Loader2, User as UserIcon, Mail, Phone, AlertCircle, Shield, CreditCard, Check, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ebookCover from "@/assets/cover_ebook_sample.jpg";
import { PRICING_CONFIG, PRODUCTS, formatPrice } from "@/config/pricing";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

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

  // Product Selection State
  const [selectedTier, setSelectedTier] = useState<'essential' | 'full'>('full');
  const [includeBazi, setIncludeBazi] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  // Billing state
  const [billingName, setBillingName] = useState(userName);
  const [billingEmail, setBillingEmail] = useState(userEmail);
  const [billingPhone, setBillingPhone] = useState(userPhone);
  const [isEmailVerified, setIsEmailVerified] = useState(true); // Default true for guest users

  //Check email verification status
  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Guest users or verified users can purchase
      setIsEmailVerified(!user || user.email_confirmed_at !== null);
    };
    if (isOpen) {
      checkEmailVerification();
    }
  }, [isOpen]);

  // Update state when props change
  useEffect(() => {
    if (isOpen) {
      setBillingName(userName);
      setBillingEmail(userEmail);
      setBillingPhone(userPhone);
      // Reset selections
      setSelectedTier('full');
      setIncludeBazi(false);

      // Track Initiate Checkout
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout');
      }
    }
  }, [isOpen, userName, userEmail, userPhone]);

  // Calculate Totals
  const selectedProduct = selectedTier === 'full' ? PRODUCTS.FULL_REPORT : PRODUCTS.ESSENTIAL_REPORT;

  const getSubtotal = () => {
    let total = selectedProduct.price;
    if (includeBazi) total += PRODUCTS.BAZI_ADDON.price;
    return total;
  };

  const getTotalWithDiscount = () => {
    let total = getSubtotal();
    if (appliedCoupon) {
      if (appliedCoupon.discount_type === 'full_free') return 0;
      if (appliedCoupon.discount_type === 'percentage') {
        return Math.round(total * (1 - Number(appliedCoupon.discount_value) / 100));
      }
    }
    return total;
  };

  const getSavings = () => {
    const originalTotal = (selectedTier === 'full' ? PRODUCTS.FULL_REPORT.original_price : PRODUCTS.ESSENTIAL_REPORT.original_price)
      + (includeBazi ? PRODUCTS.BAZI_ADDON.original_price : 0);
    const currentTotal = getSubtotal();
    return Math.round(((originalTotal - currentTotal) / originalTotal) * 100);
  };

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

    setIsLoading(true);

    try {
      // 0. Handle Buyer Guest: If no chartId exists (guest user), save chart now to get an ID
      let finalChartIds = chartId ? [chartId] : [];

      if (!chartId && birthData && chartData) {
        try {
          const birthDateStr = `${birthData.year}-${String(birthData.month).padStart(2, '0')}-${String(birthData.day).padStart(2, '0')}`;
          const birthTimeStr = `${String(birthData.hour).padStart(2, '0')}:${String(birthData.minute).padStart(2, '0')}:00`;

          // Generate ID client-side
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
          } else {
            finalChartIds = [newChartId];
          }
        } catch (err) {
          console.error('Auto-save chart exception:', err);
        }
      }

      // Generate Reference ID uniquely
      const referenceId = `TB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const productItems = [selectedProduct.id];
      if (includeBazi) productItems.push(PRODUCTS.BAZI_ADDON.id);

      const productNameFull = `${selectedProduct.name}${includeBazi ? ' + Bazi Addon' : ''}: ${userName}`;
      const finalAmount = getTotalWithDiscount();

      // 1. Save order to database first
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId || null,
          reference_id: referenceId,
          customer_name: billingName,
          customer_email: billingEmail,
          customer_phone: billingPhone,
          product_name: productNameFull,
          amount: finalAmount,
          status: 'PENDING',
          metadata: {
            chart_ids: finalChartIds,
            birth_data: birthData,
            coupon_code: couponCode,
            products: productItems,
            tier: selectedTier
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
          amount: finalAmount,
          productName: productNameFull,
          chartIds: finalChartIds,
          birthData: birthData,
          couponCode: couponCode,
          products: productItems // Pass product list to backend
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
        onClose();
        toast.success('Mengarahkan ke halaman pembayaran...');
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

  const handleRedeemFree = async () => {
    // Reuse logic similar to handleBuy but calling redeem endpoint
    // Keeping it simple here, usually coupons apply to the base price
    // For free coupons, we probably want to support the Full Report
    // Logic would be similar to existing, just ensuring charts are saved

    // ... (Implementation similar to original but using new params if needed)
    // For now, assuming redeem-free-order backend handles it based on coupon config
    setIsLoading(true);
    try {
      let finalChartIds = chartId ? [chartId] : [];
      if (!chartId && birthData && chartData) {
        const newChartId = crypto.randomUUID();
        // ... saving logic ...
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
          productName: `Full Report Human Design (Free): ${userName}`,
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


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl text-center text-foreground">
              Pilih Paket Laporan Human Design
            </DialogTitle>
            <DialogDescription className="sr-only">
              Pilih paket laporan yang sesuai dengan kebutuhan Anda
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 mt-4">

            {/* Product Tier Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Essential Package */}
              <div
                className={cn(
                  "border rounded-xl p-4 cursor-pointer transition-all relative",
                  selectedTier === 'essential'
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/50"
                )}
                onClick={() => setSelectedTier('essential')}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">Essential</h3>
                  <div className="text-right">
                    <span className="block text-xl font-bold text-primary">{formatPrice(PRODUCTS.ESSENTIAL_REPORT.price)}</span>
                    <span className="block text-xs text-muted-foreground line-through">{formatPrice(PRODUCTS.ESSENTIAL_REPORT.original_price)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Ringkasan fundamental desain Anda (20-30 halaman).</p>
                <ul className="space-y-1.5 mb-4">
                  {PRODUCTS.ESSENTIAL_REPORT.features.slice(0, 4).map((feat, idx) => (
                    <li key={idx} className="text-xs flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                {selectedTier === 'essential' && (
                  <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
                    Dipilih
                  </div>
                )}
              </div>

              {/* Full Package */}
              <div
                className={cn(
                  "border rounded-xl p-4 cursor-pointer transition-all relative overflow-hidden",
                  selectedTier === 'full'
                    ? "border-accent bg-accent/10 ring-1 ring-accent"
                    : "border-border bg-card hover:border-accent/50"
                )}
                onClick={() => setSelectedTier('full')}
              >
                <div className="absolute top-0 right-0 bg-accent text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  TERLARIS
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">Full Report</h3>
                  <div className="text-right mt-1">
                    <span className="block text-xl font-bold text-accent">{formatPrice(PRODUCTS.FULL_REPORT.price)}</span>
                    <span className="block text-xs text-muted-foreground line-through">{formatPrice(PRODUCTS.FULL_REPORT.original_price)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Analisis 100+ halaman super lengkap.</p>
                <ul className="space-y-1.5">
                  {PRODUCTS.FULL_REPORT.features.slice(0, 5).map((feat, idx) => (
                    <li key={idx} className="text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li className="text-xs flex items-start gap-2 font-semibold text-accent">
                    <Plus className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Semua fitur Essential</span>
                  </li>
                </ul>
                {selectedTier === 'full' && (
                  <div className="absolute bottom-2 right-2 text-accent opacity-20">
                    <CheckCircle2 className="w-16 h-16" />
                  </div>
                )}
              </div>
            </div>

            {/* Add-on Selection */}
            <div className="bg-secondary/20 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4">
              <Checkbox
                id="bazi-addon"
                checked={false}
                disabled={true}
                className="w-5 h-5 border-muted-foreground/30 data-[state=checked]:bg-muted data-[state=checked]:text-muted-foreground cursor-not-allowed"
              />
              <div className="flex-1 opacity-60">
                <Label htmlFor="bazi-addon" className="font-semibold text-sm block text-muted-foreground cursor-not-allowed">
                  Tambah Bazi Report Add-on (Coming Soon)
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Analisis elemen keberuntungan tahunan berdasarkan astrologi Cina.
                </p>
              </div>
            </div>

            {/* Billing Inputs */}
            <div className="space-y-3 border-t border-border pt-4">
              <h4 className="font-semibold text-foreground text-sm">Data Penerima Report:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="billing-name" className="text-xs">Nama Lengkap</Label>
                  <Input id="billing-name" value={billingName} onChange={handleNameChange} placeholder="Nama Lengkap" className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="billing-email" className="text-xs">Email</Label>
                  <Input id="billing-email" type="email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} placeholder="email@contoh.com" className="h-9 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billing-phone" className="text-xs">WhatsApp</Label>
                <Input id="billing-phone" type="tel" value={billingPhone} onChange={(e) => setBillingPhone(e.target.value)} placeholder="+628..." className="h-9 text-sm" />
              </div>
            </div>

            {/* Coupon Input */}
            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold">Kode Kupon</Label>
                {appliedCoupon && (
                  <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Hemat {appliedCoupon.discount_value}%
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Masukkan kode promo"
                  className="h-9 text-sm uppercase"
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <Button variant="outline" size="sm" onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-destructive border-destructive hover:bg-destructive/10 h-9">
                    Hapus
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={checkCoupon} disabled={isCheckingCoupon || !couponCode} className="h-9">
                    {isCheckingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek'}
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary & CTA */}
            <div className="bg-secondary/30 rounded-xl p-4 border border-border space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{selectedProduct.name}</span>
                  <span>{formatPrice(selectedProduct.price)}</span>
                </div>
                {includeBazi && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bazi Report Add-on</span>
                    <span>{formatPrice(PRODUCTS.BAZI_ADDON.price)}</span>
                  </div>
                )}
                {appliedCoupon && appliedCoupon.discount_type !== 'full_free' && (
                  <div className="flex justify-between text-green-500">
                    <span>Diskon ({appliedCoupon.discount_value}%)</span>
                    <span>- {formatPrice(getSubtotal() - getTotalWithDiscount())}</span>
                  </div>
                )}

                <div className="flex justify-between items-end border-t border-border pt-2 mt-2">
                  <span className="font-semibold text-lg">Total</span>
                  <div className="text-right">
                    {appliedCoupon?.discount_type === 'full_free' ? (
                      <span className="text-xl font-bold text-green-500">GRATIS</span>
                    ) : (
                      <>
                        <span className="text-xs text-muted-foreground line-through mr-2">
                          {formatPrice((selectedTier === 'full' ? PRODUCTS.FULL_REPORT.original_price : PRODUCTS.ESSENTIAL_REPORT.original_price) + (includeBazi ? PRODUCTS.BAZI_ADDON.original_price : 0))}
                        </span>
                        <span className="text-xl font-bold text-primary">{formatPrice(getTotalWithDiscount())}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full">
                    Hemat {getSavings()}%
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              {appliedCoupon?.discount_type === 'full_free' ? (
                <Button
                  onClick={handleRedeemFree}
                  disabled={isLoading || !billingName || !billingEmail}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-6"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Klaim Report Gratis
                </Button>
              ) : (
                <>
                  {/* Email Verification Warning */}
                  {!isEmailVerified && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">⚠️</span>
                        <div>
                          <p className="text-sm font-semibold text-amber-500 mb-1">
                            Konfirmasi Email Diperlukan
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Silakan konfirmasi email Anda terlebih dahulu untuk melakukan pembelian. Cek inbox atau halaman akun untuk kirim ulang email verifikasi.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleBuy}
                    disabled={isLoading || !billingName || !billingEmail || !isEmailVerified}
                    size="lg"
                    className="w-full fire-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Bayar {formatPrice(getTotalWithDiscount())}
                      </>
                    )}
                  </Button>
                  <p className="text-center text-[10px] text-muted-foreground">
                    <a href="/kebijakan-pengembalian-dana#human-design-report" target="_blank" className="text-primary hover:underline">
                      Garansi 100%
                    </a>
                    {' '}jika ada kesalahan. Transaksi aman & terenkripsi.
                  </p>
                </>
              )}
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
