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
    Sparkles, Flame
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
    onSubmit: (data: UnifiedCheckoutData) => Promise<void>;
    isLoading: boolean;
    user: User | null; // User object from supabase (optional pre-fill)
    skipBirthData?: boolean; // Skip birth data input (for saved charts)
    prefillBirthData?: {
        birthDate: string;
        birthTime: string;
        birthCity: string;
        gender: 'male' | 'female';
        name?: string; // Additional prefill support
    };
    selectedProductId?: string;
}

export function UnifiedCheckoutModal({
    open,
    onOpenChange,
    onSubmit,
    isLoading,
    user,
    skipBirthData = false,
    prefillBirthData,
    selectedProductId
}: UnifiedCheckoutModalProps) {
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

    // Pre-fill data logic
    useEffect(() => {
        if (open) {
            // Priority 1: User Logged In Data
            if (user) {
                if (user.user_metadata?.name) setName(user.user_metadata.name);
                if (user.email) setEmail(user.email);
                if (user.user_metadata?.whatsapp) setWhatsapp(user.user_metadata.whatsapp);
            }

            // Priority 2: Prefill Data (overrides user data if specific to chart, or fills empty)
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
                if (prefillBirthData.name && !name) setName(prefillBirthData.name);
            }
        }
    }, [user, open, prefillBirthData, name]);

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
                // 1. Check General Coupons Table
                const { data: couponData, error: couponError } = await supabase
                    .from('coupons')
                    .select('*')
                    .eq('code', cleanCode)
                    .eq('is_active', true)
                    .maybeSingle();

                if (couponData) {
                    setDiscountAmount(couponData.discount_value);
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
                    const originalPrice = PRODUCTS.FULL_REPORT.price;
                    const affiliateDiscount = Math.round(originalPrice * 0.10); // 10%

                    setDiscountAmount(affiliateDiscount);
                    setIsCouponValid(true);
                    setCouponMessage('Kode referal affiliate valid!');
                    setIsValidatingCoupon(false);
                    return;
                }

                // If neither found
                setDiscountAmount(0);
                setIsCouponValid(false);
                setCouponMessage('Kode kupon tidak ditemukan atau tidak aktif');

            } catch (err) {
                console.error('Error validating coupon:', err);
                setIsCouponValid(false);
            } finally {
                setIsValidatingCoupon(false);
            }
        }, 800); // 800ms debounce

        return () => clearTimeout(timer);
    }, [couponCode]);

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
        return isPersonalValid && isBirthValid && isAgreed;
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
        // Only allow purchase if user has an existing record in whatsapp_sessions (meaning they are a past customer)
        // using the cleaned phone number
        if (open && selectedProductId === PRODUCTS.WHATSAPP_KIRA_SUBSCRIPTION.id) {
            setIsLoading(true); // Re-use loading state if possible, or assume caller handles it?
            // Actually, this handleSubmit calls 'onSubmit' which might be outside.
            // We should do the check logic HERE before calling onSubmit.

            try {
                // Determine the clean phone (simplified version matching webhook logic)
                let checkPhone = cleanPhone;
                if (checkPhone.startsWith('0')) checkPhone = '62' + checkPhone.slice(1);

                const { data: session } = await supabase
                    .from('whatsapp_sessions')
                    .select('id')
                    .eq('whatsapp', checkPhone)
                    .maybeSingle();

                if (!session) {
                    toast({
                        title: "Maaf, khusus Alumni Teman Batin",
                        description: "Langganan Kira hanya tersedia untuk yang pernah membeli Report Human Design / Bazi sebelumnya.",
                        variant: "destructive"
                    });
                    // setIsLoading(false); // If we managed loading state
                    return;
                }
            } catch (err) {
                console.error("Eligibility check failed", err);
                // Fallthrough or block? Block is safer.
                return;
            }
        }

        const birthCity = selectedCity?.display_name || '';

        await onSubmit({
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
            finalPrice: PRODUCTS.FULL_REPORT.price - discountAmount
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto p-0 gap-0">
                {/* Header */}
                <div className="p-6 pb-4 border-b border-border/50">
                    <DialogTitle className="text-2xl font-bold text-gradient-fire">
                        Langkah Terakhir Menuju Kejelasan
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1">
                        Lengkapi detail penerima report di bawah ini.
                    </DialogDescription>
                </div>

                <div className="p-6 space-y-8">
                    {/* Section 1: Data Penerima */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</div>
                            <h3 className="font-semibold text-foreground">Data Penerima Report</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nama (untuk ditulis dalam reading)</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Nama kamu"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Nomor WhatsApp (Aktif)</Label>
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
                                <Label>Email (Untuk Pengiriman hasil reading)</Label>
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
                                <Label>Jenis Kelamin (untuk personalisasi cover)</Label>
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
                                <h4 className="font-bold text-lg">Full Personal Report</h4>
                                <p className="text-xs text-muted-foreground">Blueprint Personal Human Design (100+ Halaman)</p>
                            </div>
                            <div className="text-right">
                                {isCouponValid ? (
                                    <>
                                        <div className="text-sm text-muted-foreground line-through decoration-red-500/50">{formatPrice(PRODUCTS.FULL_REPORT.price)}</div>
                                        <div className="text-xl font-bold text-accent">{formatPrice(PRODUCTS.FULL_REPORT.price - discountAmount)}</div>
                                        <div className="text-[10px] text-green-500 font-medium animate-pulse">Hemat {formatPrice(discountAmount)}</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-xl font-bold text-accent">{formatPrice(PRODUCTS.FULL_REPORT.price)}</div>
                                        <div className="text-xs text-muted-foreground line-through">{formatPrice(PRODUCTS.FULL_REPORT.original_price)}</div>
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
                            {/* Add-on Teasers (Optional) remain same */}
                            <div className="pb-2">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="included" className="border-b-0">
                                        <AccordionTrigger className="hover:no-underline py-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-foreground text-left text-xs">🎁 Bonus Spesial (Termasuk)</h3>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-1 gap-3 pt-2 pb-2">
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
                                                    <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded-full">FREE</span>
                                                </div>

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
                                                    <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded-full">INCLUDED</span>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

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
