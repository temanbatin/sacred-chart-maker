import { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    User as UserIcon, Mail, Phone, Calendar, Clock, MapPin,
    Loader2, Shield, ScrollText, HeartHandshake, Baby, TicketPercent,
    Sparkles, Flame, MessageCircle, Fingerprint, CalendarDays, Lock, Check
} from 'lucide-react';
import { formatPrice } from '@/config/pricing';
import { PRODUCTS, COUPONS } from '@/config/pricing';
import { toast } from '@/hooks/use-toast';
import { LiveSocialProof } from './LiveSocialProof';

interface City {
    display_name: string;
    lat: string;
    lon: string;
    address?: {
        city?: string;
        town?: string;
        village?: string;
        hamlet?: string;
        county?: string;
        state?: string;
        country?: string;
    };
}

// Interface for paid orders (for subscription chart selection)
interface PaidOrder {
    id: string;
    reference_id: string;
    product_name: string;
    paid_at: string;
    customer_name?: string;
    metadata?: {
        birthData?: {
            name?: string;
        };
        report_type?: string;
    };
}

import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedCheckoutData {
    // Personal & Account
    name: string;
    email: string;
    whatsapp: string;
    // password removed - direct checkout

    // Birth Data
    birthDate: string;
    birthTime: string;
    birthCity: string;
    gender: 'male' | 'female';

    // Agreements
    agreedToTerms: boolean;
    agreedToTnc: boolean;

    // Coupon
    couponCode?: string;
    discountAmount?: number;
    finalPrice?: number;
}

interface UnifiedCheckoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit?: (data: UnifiedCheckoutData) => Promise<void>; // Optional - if not provided, uses built-in checkout
    isLoading?: boolean; // Optional - managed internally if not provided
    user?: User | null; // Optional - fetched internally if not provided
    skipBirthData?: boolean; // Skip birth data input (for saved charts)
    prefillBirthData?: {
        birthDate: string;
        birthTime: string;
        birthCity: string;
        gender: 'male' | 'female';
        name?: string;
        whatsapp?: string;
        email?: string;
    };
    selectedProductId?: string;
}

// Helper function to get product info based on selectedProductId
function getProductInfo(productId?: string) {
    switch (productId) {
        case PRODUCTS.BAZI_ONLY.id:
            return {
                product: PRODUCTS.BAZI_ONLY,
                title: 'Dapatkan Analisis Bazi Lengkap',
                description: 'Weather & Fuel Report untuk navigasi hidup Anda.',
                skipBirthData: false,
                showBonus: true,
                bonusType: 'bazi' as const,
                // Custom labels for Bazi - simplified
                labels: {
                    name: 'Nama',
                    namePlaceholder: 'Nama kamu',
                    sectionTitle: 'Data Penerima Report',
                    whatsappLabel: 'Nomor WhatsApp (Aktif)',
                    emailLabel: 'Email (Untuk Pengiriman hasil reading)',
                    gender: 'Jenis Kelamin',
                    birthTimeHint: null // No hint for Bazi
                }
            };
        case PRODUCTS.WHATSAPP_KIRA_SUBSCRIPTION.id:
            return {
                product: PRODUCTS.WHATSAPP_KIRA_SUBSCRIPTION,
                title: 'Aktivasi Kira AI Mentor',
                description: 'Mentor personal 24/7 via WhatsApp yang paham Design & Bazi kamu.',
                skipBirthData: true, // No birth data needed for subscription
                showBonus: false,
                bonusType: 'subscription' as const,
                labels: {
                    name: 'Nama',
                    namePlaceholder: 'Panggilanmu untuk Kira',
                    sectionTitle: 'Data untuk chat dengan Kira',
                    whatsappLabel: 'Nomor WhatsApp (yang didaftarkan ke Kira)',
                    emailLabel: 'Email',
                    gender: 'Jenis Kelamin',
                    birthTimeHint: null
                }
            };
        default:
            return {
                product: PRODUCTS.FULL_REPORT,
                title: 'Langkah Terakhir Menuju Kejelasan',
                description: 'Lengkapi detail penerima report di bawah ini.',
                skipBirthData: false,
                showBonus: true,
                bonusType: 'bundle' as const,
                // Custom labels for Full Report Bundle - detailed
                labels: {
                    name: 'Nama (untuk ditulis dalam reading)',
                    namePlaceholder: 'Nama kamu',
                    sectionTitle: 'Data Penerima Report',
                    whatsappLabel: 'Nomor WhatsApp (Aktif)',
                    emailLabel: 'Email (Untuk Pengiriman hasil reading)',
                    gender: 'Jenis Kelamin (untuk personalisasi cover)',
                    birthTimeHint: 'Agar reading akurat, pastikan jam lahir sesuai'
                }
            };
    }
}

export function UnifiedCheckoutModal({
    open,
    onOpenChange,
    onSubmit,
    isLoading: isLoadingProp,
    user: userProp,
    skipBirthData: skipBirthDataProp = false,
    prefillBirthData,
    selectedProductId
}: UnifiedCheckoutModalProps) {
    // Get product-specific info
    const productInfo = getProductInfo(selectedProductId);
    const selectedProduct = productInfo.product;
    // Skip birth data if prop says so OR if product doesn't need it (like subscription)
    const skipBirthData = skipBirthDataProp || productInfo.skipBirthData;

    // Internal state for standalone mode
    const [internalLoading, setInternalLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Use provided values or internal state
    const isLoading = isLoadingProp !== undefined ? isLoadingProp : internalLoading;
    const user = userProp !== undefined ? userProp : currentUser;

    // Fetch current user on mount if not provided
    useEffect(() => {
        if (userProp === undefined && open) {
            supabase.auth.getUser().then(({ data }) => {
                setCurrentUser(data?.user || null);
            });
        }
    }, [open, userProp]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');

    // Birth Data State
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');

    // City Search State
    const [citySearch, setCitySearch] = useState('');
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
    const [isSearchingCity, setIsSearchingCity] = useState(false);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Agreements State
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToTnc, setAgreedToTnc] = useState(false);

    // Subscription: Paid Orders State
    const [paidOrders, setPaidOrders] = useState<PaidOrder[]>([]);
    const [selectedPaidOrderId, setSelectedPaidOrderId] = useState<string>('');
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    // Track previous open state to only pre-fill on modal open (not on every state change)
    const prevOpenRef = useRef(false);

    // Pre-fill data logic - only runs when modal first opens
    useEffect(() => {
        // Only pre-fill when modal transitions from closed to open
        if (open && !prevOpenRef.current) {
            // Priority 1: User Logged In Data
            if (user) {
                if (user.user_metadata?.name) setName(user.user_metadata.name);
                if (user.email) setEmail(user.email);
                if (user.user_metadata?.whatsapp) setWhatsapp(user.user_metadata.whatsapp);
            }

            // Priority 2: Prefill Data (overrides user data if specific to chart)
            if (prefillBirthData) {
                setBirthDate(prefillBirthData.birthDate);
                setBirthTime(prefillBirthData.birthTime);

                // If birth city is provided
                if (prefillBirthData.birthCity) {
                    setCitySearch(prefillBirthData.birthCity);
                    setSelectedCity({
                        display_name: prefillBirthData.birthCity,
                        lat: '0',
                        lon: '0'
                    });
                }

                if (prefillBirthData.gender) setGender(prefillBirthData.gender);
                if (prefillBirthData.name) setName(prefillBirthData.name);
                if (prefillBirthData.whatsapp) setWhatsapp(prefillBirthData.whatsapp);
                if (prefillBirthData.email) setEmail(prefillBirthData.email);
            }
        }

        // Update previous open state
        prevOpenRef.current = open;
    }, [open, user, prefillBirthData]);

    // Fetch paid orders for subscription (only when subscription modal is opened)
    useEffect(() => {
        if (open && selectedProductId === PRODUCTS.WHATSAPP_KIRA_SUBSCRIPTION.id && user) {
            const fetchPaidOrders = async () => {
                setIsLoadingOrders(true);
                try {
                    const { data, error } = await supabase
                        .from('orders')
                        .select('id, reference_id, product_name, paid_at, customer_name, metadata')
                        .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
                        .eq('status', 'PAID')
                        .order('paid_at', { ascending: false });

                    if (error) {
                        console.error('Error fetching paid orders:', error);
                    } else {
                        // Filter out Kira subscription orders - only show Report/Bundle/Bazi orders
                        const ordersData = ((data || []) as unknown as PaidOrder[]).filter(order => {
                            const productName = order.product_name?.toLowerCase() || '';
                            const reportType = order.metadata?.report_type || '';
                            // Exclude Kira subscription orders
                            const isKiraSubscription = productName.includes('kira') || reportType === 'kira-subscription';
                            return !isKiraSubscription;
                        });
                        setPaidOrders(ordersData);
                        // Pre-select the first order if available
                        if (ordersData.length > 0) {
                            setSelectedPaidOrderId(ordersData[0].id);
                        }
                    }
                } catch (err) {
                    console.error('Error:', err);
                } finally {
                    setIsLoadingOrders(false);
                }
            };
            fetchPaidOrders();
        }
    }, [open, selectedProductId, user]);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isCouponValid, setIsCouponValid] = useState(false);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [couponMessage, setCouponMessage] = useState('');

    // Debounce coupon validation
    useEffect(() => {
        const cleanCode = couponCode.replace(/\s/g, '').toUpperCase();

        if (!cleanCode) {
            setDiscountAmount(0);
            setIsCouponValid(false);
            setCouponMessage('');
            return;
        }

        const timer = setTimeout(async () => {
            setIsValidatingCoupon(true);
            setCouponMessage('');

            try {
                // 1. Check General Coupons via RPC (bypasses RLS, case-insensitive)
                // @ts-ignore - RPC function exists in database
                const { data: couponResult, error: couponError } = await supabase
                    .rpc('check_coupon_validity', { coupon_code: cleanCode });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const couponData = couponResult as any;

                if (couponData && couponData.valid) {
                    // Handle full_free coupons (100% discount)
                    if (couponData.discount_type === 'full_free') {
                        setDiscountAmount(selectedProduct.price); // Full discount
                        setIsCouponValid(true);
                        setCouponMessage('🎉 Kupon gratis berhasil digunakan!');
                        setIsValidatingCoupon(false);
                        return;
                    }

                    // Handle percentage discount
                    if (couponData.discount_type === 'percentage') {
                        const discountPercent = Number(couponData.discount_value) || 0;
                        const discountAmt = Math.round(selectedProduct.price * (discountPercent / 100));
                        setDiscountAmount(discountAmt);
                        setIsCouponValid(true);
                        setCouponMessage(`Kupon diskon ${discountPercent}% berhasil!`);
                        setIsValidatingCoupon(false);
                        return;
                    }

                    // Handle fixed amount discount
                    setDiscountAmount(Number(couponData.discount_value) || 0);
                    setIsCouponValid(true);
                    setCouponMessage('Kupon berhasil digunakan!');
                    setIsValidatingCoupon(false);
                    return;
                }

                // 2. Check Affiliate Coupons (via Secure RPC)
                const { data: rpcData, error: rpcError } = await supabase
                    .rpc('validate_affiliate_coupon', { lookup_code: cleanCode });

                // Check if RPC returned valid data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (rpcData && (rpcData as any).valid) {
                    // Affiliate Discount Policy: 10%
                    const originalPrice = selectedProduct.price;
                    const affiliateDiscount = Math.round(originalPrice * 0.10); // 10%

                    setDiscountAmount(affiliateDiscount);
                    setIsCouponValid(true);
                    setCouponMessage('Kode referal affiliate valid!');
                    setIsValidatingCoupon(false);
                    return;
                }

                // If neither found - show appropriate message
                setDiscountAmount(0);
                setIsCouponValid(false);
                setCouponMessage(couponData?.message || 'Kode kupon tidak ditemukan atau tidak aktif');

            } catch (err) {
                console.error('Error validating coupon:', err);
                setIsCouponValid(false);
            } finally {
                setIsValidatingCoupon(false);
            }
        }, 800); // 800ms debounce

        return () => clearTimeout(timer);
    }, [couponCode, selectedProduct.price]);

    // City Autocomplete Logic
    const searchCities = useCallback(async (query: string) => {
        if (query.length < 3) {
            setCitySuggestions([]);
            return;
        }
        setIsSearchingCity(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
            const data = await response.json();
            setCitySuggestions(data);
            setShowCitySuggestions(true);
        } catch (error) {
            console.error('Error searching cities:', error);
        } finally {
            setIsSearchingCity(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (citySearch && !selectedCity) {
            debounceRef.current = setTimeout(() => searchCities(citySearch), 300);
        }
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [citySearch, selectedCity, searchCities]);

    const handleCitySelect = (city: City) => {
        setSelectedCity(city);
        setCitySearch(city.display_name);
        setShowCitySuggestions(false);
    };

    const isFormValid = () => {
        const isPersonalValid = !!(name && email && whatsapp);
        const isBirthValid = skipBirthData || !!(birthDate && birthTime && selectedCity && gender); // Gender required
        const isAgreed = agreedToTerms && agreedToTnc;
        // For subscription, require a selected paid order
        const isSubscriptionValid = selectedProductId !== PRODUCTS.WHATSAPP_KIRA_SUBSCRIPTION.id ||
            (paidOrders.length > 0 && selectedPaidOrderId);
        return isPersonalValid && isBirthValid && isAgreed && isSubscriptionValid;
    };

    const handleSubmit = async () => {
        // Validate WhatsApp format
        const cleanPhone = whatsapp.replace(/[^\d+]/g, '');

        if (!cleanPhone || cleanPhone.length < 10) {
            toast({
                title: "Nomor WhatsApp tidak valid",
                description: "Minimal 10 digit. Contoh: 08123456789",
                variant: "destructive"
            });
            return;
        }

        // Basic prefix check
        if (!cleanPhone.startsWith('0') && !cleanPhone.startsWith('62') && !cleanPhone.startsWith('+62')) {
            toast({
                title: "Format nomor WhatsApp salah",
                description: "Awali dengan 08... atau 62...",
                variant: "destructive"
            });
            return;
        }

        if (!isFormValid()) {
            toast({
                variant: "destructive"
            });
            return;
        }

        // ELIGIBILITY CHECK: Kira Subscription
        // Only allow purchase if user has paid orders (already fetched into paidOrders state)
        if (selectedProductId === PRODUCTS.WHATSAPP_KIRA_SUBSCRIPTION.id) {
            if (paidOrders.length === 0 || !selectedPaidOrderId) {
                toast({
                    title: "Maaf, khusus Alumni Teman Batin",
                    description: "Langganan Kira hanya tersedia untuk yang sudah pernah membeli Report Human Design / Bazi.",
                    variant: "destructive"
                });
                return;
            }
        }

        const birthCity = selectedCity?.display_name || '';

        // Prepare checkout data
        const checkoutData: UnifiedCheckoutData = {
            name,
            email,
            whatsapp,
            birthDate,
            birthTime,
            birthCity,
            gender,
            agreedToTerms,
            agreedToTnc,
            couponCode: isCouponValid ? couponCode : undefined,
            discountAmount,
            finalPrice: selectedProduct.price - discountAmount
        };

        // If external onSubmit is provided, use it
        if (onSubmit) {
            await onSubmit(checkoutData);
            return;
        }

        // ============ Built-in checkout logic (standalone mode) ============
        setInternalLoading(true);
        try {
            // Helper: Format WhatsApp (08xx -> 628xx)
            const formatWhatsApp = (number: string): string => {
                if (!number || number.trim() === '') {
                    throw new Error('WhatsApp number is required');
                }
                let cleaned = number.replace(/\D/g, ''); // Remove non-digits
                if (cleaned.startsWith('0')) {
                    cleaned = '62' + cleaned.slice(1);
                }
                if (!cleaned.startsWith('62')) {
                    cleaned = '62' + cleaned;
                }
                return '+' + cleaned;
            };

            const formattedWhatsapp = formatWhatsApp(checkoutData.whatsapp);

            // Parse and validate date/time
            const [year, month, day] = checkoutData.birthDate.split('-').map(Number);
            const [hour, minute] = checkoutData.birthTime.split(':').map(Number);

            if (!skipBirthData && (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute))) {
                toast({
                    title: "Format tanggal atau waktu tidak valid",
                    variant: "destructive"
                });
                setInternalLoading(false);
                return;
            }

            const birthDateStr = skipBirthData ? '' : `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Format birth data for metadata
            const birthDataForMetadata = skipBirthData ? null : {
                name: checkoutData.name,
                year,
                month,
                day,
                hour,
                minute,
                place: checkoutData.birthCity,
                gender: checkoutData.gender
            };

            // Submit Lead (optional, fire-and-forget)
            if (!skipBirthData) {
                try {
                    await supabase.functions.invoke('submit-lead', {
                        body: {
                            name: checkoutData.name,
                            email: checkoutData.email,
                            whatsapp: formattedWhatsapp,
                            birth_date: birthDateStr,
                            birth_place: checkoutData.birthCity,
                        }
                    });
                } catch (leadError) {
                    console.warn("Lead submission failed, continuing...", leadError);
                }
            }

            // Calculate Chart to get Snapshot (only for non-subscription products)
            let chartSnapshot = null;
            if (!skipBirthData && birthDataForMetadata) {
                try {
                    const { data: chartData, error: chartError } = await supabase.functions.invoke('calculate-chart', {
                        body: {
                            year,
                            month,
                            day,
                            hour,
                            minute,
                            place: checkoutData.birthCity,
                            gender: checkoutData.gender,
                        },
                    });
                    if (!chartError && chartData) {
                        chartSnapshot = chartData;
                    }
                } catch (err) {
                    console.warn("Failed to calculate chart snapshot:", err);
                }
            }

            // Check if FREE coupon (finalPrice === 0)
            const isFreeOrder = checkoutData.finalPrice === 0 && checkoutData.couponCode;

            // Use product config for correct naming and report_type
            const productName = `${selectedProduct.name}: ${checkoutData.name}`;
            const reportType = selectedProduct.report_type;

            if (isFreeOrder) {
                // --- FREE COUPON FLOW: Call redeem-free-order directly ---
                console.log('🎁 Free coupon detected, calling redeem-free-order...');

                const referenceId = `TB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

                const redeemPayload = {
                    couponCode: checkoutData.couponCode,
                    referenceId: referenceId,
                    customerName: checkoutData.name,
                    customerEmail: checkoutData.email,
                    customerPhone: formattedWhatsapp,
                    productName: productName,
                    reportType: reportType,
                    chartIds: [],
                    birthData: birthDataForMetadata,
                    userId: user?.id || null
                };

                const { data: redeemResult, error: redeemError } = await supabase.functions.invoke('redeem-free-order', {
                    body: redeemPayload
                });

                if (redeemError) {
                    console.error('Redeem error:', redeemError);
                    throw new Error(redeemError.message || 'Gagal menggunakan kupon gratis');
                }

                if (redeemResult?.success && redeemResult?.redirect_url) {
                    sessionStorage.setItem('paymentRefId', referenceId);
                    onOpenChange(false);

                    toast({
                        title: '🎉 Kupon berhasil digunakan!',
                        description: 'Report kamu sedang diproses...'
                    });

                    window.location.href = redeemResult.redirect_url;
                    return;
                } else {
                    throw new Error(redeemResult?.error || 'Gagal menggunakan kupon');
                }
            }

            // --- PAID FLOW: Create Order and Call Midtrans ---
            const referenceId = `TB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

            // Get selected paid order info for subscription
            const selectedSourceOrder = paidOrders.find(o => o.id === selectedPaidOrderId);

            // Create Order
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: orderError } = await (supabase.from('orders') as any)
                .insert({
                    user_id: user?.id || null,
                    reference_id: referenceId,
                    customer_name: checkoutData.name,
                    customer_email: checkoutData.email,
                    customer_phone: formattedWhatsapp,
                    product_name: productName,
                    amount: selectedProduct.price,
                    status: 'PENDING',
                    metadata: {
                        chart_ids: [],
                        products: [selectedProduct.id],
                        report_type: reportType,
                        birth_data: birthDataForMetadata,
                        chart_snapshot: chartSnapshot,
                        // For subscription: include source order info
                        ...(selectedProductId === PRODUCTS.WHATSAPP_KIRA_SUBSCRIPTION.id && selectedSourceOrder ? {
                            subscription_source_order: {
                                id: selectedSourceOrder.id,
                                reference_id: selectedSourceOrder.reference_id,
                                product_name: selectedSourceOrder.product_name,
                                customer_name: selectedSourceOrder.customer_name
                            }
                        } : {})
                    }
                });

            if (orderError) throw orderError;

            // Call Midtrans
            const { data: paymentData, error: paymentError } = await supabase.functions.invoke('midtrans-checkout', {
                body: {
                    referenceId,
                    customerName: checkoutData.name,
                    customerEmail: checkoutData.email,
                    customerPhone: formattedWhatsapp,
                    amount: selectedProduct.price,
                    productName,
                    reportType: reportType,
                    chartIds: [],
                    products: [selectedProduct.id],
                    birthData: birthDataForMetadata
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            if (paymentError) throw paymentError;

            if (paymentData && paymentData.redirect_url) {
                onOpenChange(false);
                window.location.href = paymentData.redirect_url;
            }

        } catch (error: unknown) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast({
                title: 'Terjadi kesalahan',
                description: errorMessage || "Unknown error",
                variant: "destructive"
            });
        } finally {
            setInternalLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto p-0 gap-0">
                {/* Header */}
                <div className="p-6 pb-4 border-b border-border/50">
                    <DialogTitle className="text-2xl font-bold text-gradient-fire">
                        {productInfo.title}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1">
                        {productInfo.description}
                    </DialogDescription>
                </div>

                <div className="p-6 space-y-8">
                    {/* Section 1: Data Penerima */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</div>
                            <h3 className="font-semibold text-foreground">{productInfo.labels.sectionTitle}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{productInfo.labels.name}</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder={productInfo.labels.namePlaceholder}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>{productInfo.labels.whatsappLabel}</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="08123xxxx"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>{productInfo.labels.emailLabel}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="email@kamu.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* Section 2: Data Kelahiran */}
                    {!skipBirthData && (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">2</div>
                                <h3 className="font-semibold text-foreground">Konfirmasi Data Kelahiran</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tanggal Lahir</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            className="pl-9 bg-background/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Jam Lahir</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="time"
                                            value={birthTime}
                                            onChange={(e) => setBirthTime(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    {productInfo.labels.birthTimeHint && (
                                        <p className="text-xs text-amber-500/80 mt-1">
                                            ⚡ {productInfo.labels.birthTimeHint}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 relative md:col-span-2">
                                    <Label>Kota Kelahiran</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Ketik kota kelahiran..."
                                            value={citySearch}
                                            onChange={(e) => {
                                                setCitySearch(e.target.value);
                                                setSelectedCity(null);
                                            }}
                                            onFocus={() => citySuggestions.length > 0 && setShowCitySuggestions(true)}
                                            className="pl-9"
                                        />
                                        {isSearchingCity && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
                                    </div>
                                    {showCitySuggestions && citySuggestions.length > 0 && (
                                        <div className="z-20 w-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden max-h-40 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                                            {citySuggestions.map((city, idx) => (
                                                <button
                                                    key={idx}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors"
                                                    onClick={() => handleCitySelect(city)}
                                                >
                                                    {city.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Gender Selection */}
                            <div className="space-y-2">
                                <Label>{productInfo.labels.gender}</Label>
                                <RadioGroup
                                    value={gender}
                                    onValueChange={(v) => setGender(v as 'male' | 'female')}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2 border border-border rounded-lg p-3 flex-1 hover:bg-secondary/20 cursor-pointer">
                                        <RadioGroupItem value="male" id="g-male" />
                                        <Label htmlFor="g-male" className="cursor-pointer flex-1">Pria</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border border-border rounded-lg p-3 flex-1 hover:bg-secondary/20 cursor-pointer">
                                        <RadioGroupItem value="female" id="g-female" />
                                        <Label htmlFor="g-female" className="cursor-pointer flex-1">Wanita</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </section>
                    )}

                    {/* Section 3: Summary & Agreements */}
                    <section className="bg-secondary/20 rounded-xl p-4 border border-border/50 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-lg">{selectedProduct.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                    {productInfo.bonusType === 'subscription'
                                        ? 'Langganan Mentor AI Personal via WhatsApp'
                                        : productInfo.bonusType === 'bazi'
                                            ? 'Analisis Bazi & Weather Forecast'
                                            : 'Blueprint Personal Human Design (100+ Halaman)'}
                                </p>
                            </div>
                            <div className="text-right">
                                {isCouponValid ? (
                                    <>
                                        <div className="text-sm text-muted-foreground line-through decoration-red-500/50">{formatPrice(selectedProduct.price)}</div>
                                        <div className="text-xl font-bold text-accent">{formatPrice(selectedProduct.price - discountAmount)}</div>
                                        <div className="text-[10px] text-green-500 font-medium animate-pulse">Hemat {formatPrice(discountAmount)}</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-xl font-bold text-accent">{formatPrice(selectedProduct.price)}</div>
                                        <div className="text-xs text-muted-foreground line-through">{formatPrice(selectedProduct.original_price)}</div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Coupon Input Field */}
                        <div className="pb-3 border-b border-border/50">
                            <div className="relative">
                                <TicketPercent className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isCouponValid ? 'text-green-500' : 'text-muted-foreground'}`} />
                                <Input
                                    placeholder="Punya kode kupon / referal?"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className={`pl-9 border-dashed bg-background/50 ${isCouponValid
                                        ? 'border-green-500/50 text-green-500 focus-visible:ring-green-500'
                                        : couponCode.length > 3 && !isValidatingCoupon && !isCouponValid
                                            ? 'border-red-500/50 text-red-500 focus-visible:ring-red-500'
                                            : ''
                                        }`}
                                />
                                {isValidatingCoupon && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                                {isCouponValid && !isValidatingCoupon && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-medium animate-in fade-in zoom-in">
                                        Applied
                                    </div>
                                )}
                            </div>
                            {/* Coupon Feedback Message */}
                            {couponMessage && (
                                <p className={`text-[10px] mt-1.5 ml-1 ${isCouponValid ? 'text-green-600' : 'text-red-500'}`}>
                                    {couponMessage}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 pt-2 border-t border-border/50">
                            {/* Bonus Section - Product Specific */}
                            {productInfo.showBonus && (
                                <div className="pb-2">
                                    <h3 className="font-medium text-foreground text-xs mb-3">🎁 Bonus Spesial (Termasuk)</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {/* Kira AI Bonus - Show for bundle and bazi-only */}
                                        <div className="flex items-center justify-between p-3 border border-indigo-500/30 rounded-lg bg-indigo-500/5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-500/10 rounded-md">
                                                    <Sparkles className="w-4 h-4 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-foreground">Kira AI Mentor (30 Hari)</p>
                                                    <p className="text-[10px] text-muted-foreground">Chat 24/7 dengan mentor personal kamu</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded-full">GRATIS</span>
                                        </div>

                                        {/* Bazi Bonus - Only show for bundle */}
                                        {productInfo.bonusType === 'bundle' && (
                                            <div className="flex items-center justify-between p-3 border border-red-500/30 rounded-lg bg-red-500/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-red-500/10 rounded-md">
                                                        <Flame className="w-4 h-4 text-red-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-foreground">Bazi Chart Analysis</p>
                                                        <p className="text-[10px] text-muted-foreground">Analisis keberuntungan & elemen</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded-full">GRATIS</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Subscription Features - Show for subscription */}
                            {productInfo.bonusType === 'subscription' && (
                                <div className="pb-2 space-y-4">
                                    {/* Chart Selection for Subscription */}
                                    <div>
                                        <Label className="text-xs font-medium text-foreground mb-2 block">
                                            Pilih Chart yang akan diintegrasikan dengan Kira AI
                                        </Label>

                                        {isLoadingOrders ? (
                                            <div className="flex items-center gap-2 p-4 border border-border rounded-lg bg-muted/20">
                                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Mencari data chart kamu...</span>
                                            </div>
                                        ) : paidOrders.length === 0 ? (
                                            <div className="p-4 border border-amber-500/30 rounded-lg bg-amber-500/10">
                                                <p className="text-sm text-amber-500 font-medium mb-1">
                                                    ⚠️ Belum ada chart yang ditemukan
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Kamu perlu membeli{' '}
                                                    <a href="/personal-report" className="text-accent underline hover:text-accent/80">Report Human Design</a>
                                                    {' '}atau{' '}
                                                    <a href="/bazi" className="text-accent underline hover:text-accent/80">Bazi</a>
                                                    {' '}terlebih dahulu sebelum bisa berlangganan Kira AI.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {paidOrders.map((order) => {
                                                    const chartName = order.metadata?.birthData?.name || order.customer_name || 'Chart';
                                                    const paidDate = new Date(order.paid_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    });

                                                    return (
                                                        <div
                                                            key={order.id}
                                                            onClick={() => setSelectedPaidOrderId(order.id)}
                                                            className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedPaidOrderId === order.id
                                                                ? 'border-accent bg-accent/10'
                                                                : 'border-border hover:border-accent/50 bg-muted/10'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPaidOrderId === order.id
                                                                        ? 'border-accent bg-accent'
                                                                        : 'border-muted-foreground'
                                                                        }`}>
                                                                        {selectedPaidOrderId === order.id && (
                                                                            <Check className="w-3 h-3 text-background" />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-foreground">{chartName}</p>
                                                                        <p className="text-xs text-muted-foreground">{order.product_name}</p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs text-muted-foreground">{paidDate}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-medium text-foreground text-xs mb-3">Yang Kamu Dapatkan</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-start gap-3 p-3 border border-indigo-500/20 rounded-lg bg-indigo-500/5">
                                            <MessageCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Unlimited Chat 24/7</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 border border-purple-500/20 rounded-lg bg-purple-500/5">
                                            <Fingerprint className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Custom AI Sesuai Bazi dan Human Design-mu</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 border border-amber-500/20 rounded-lg bg-amber-500/5">
                                            <CalendarDays className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Tanya seputar kehidupan sesuai hari</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 border border-emerald-500/20 rounded-lg bg-emerald-500/5">
                                            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Ruang aman (privasi terjaga)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 border-t border-border/50">
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="term1"
                                        checked={agreedToTerms}
                                        onCheckedChange={(c) => setAgreedToTerms(c as boolean)}
                                    />
                                    <label htmlFor="term1" className="text-xs text-muted-foreground leading-snug cursor-pointer">
                                        Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi
                                    </label>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="term2"
                                        checked={agreedToTnc}
                                        onCheckedChange={(c) => setAgreedToTnc(c as boolean)}
                                    />
                                    <label htmlFor="term2" className="text-xs text-muted-foreground leading-snug cursor-pointer">
                                        Data kelahiran & detail penerima sudah benar (dikirim ke email di atas)
                                    </label>
                                </div>
                            </div>

                            {/* Live Social Proof */}
                            <LiveSocialProof className="pt-3 border-t border-border/30" />
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-2 bg-background border-t border-border/50 sticky bottom-0">
                    <Button
                        className="w-full fire-glow py-6 text-lg font-bold"
                        onClick={handleSubmit}
                        disabled={isLoading || !isFormValid()}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                Mulai Transformasi Sekarang
                                <Shield className="w-5 h-5 ml-2 opacity-80" />
                            </>
                        )}
                    </Button>
                    <div className="text-center mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        <span>Garansi 100% Uang Kembali 7 Hari</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
