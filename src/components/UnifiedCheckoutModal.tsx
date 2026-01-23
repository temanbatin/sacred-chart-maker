import { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    User, Mail, Phone, Lock, Calendar, Clock, MapPin,
    Loader2, CreditCard, ChevronRight, CheckCircle2, Shield,
    ScrollText, HeartHandshake, Baby, LogIn
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/config/pricing';
import { PRODUCTS } from '@/config/pricing';
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

export interface UnifiedCheckoutData {
    // Personal & Account
    name: string;
    email: string;
    whatsapp: string;
    password?: string; // Optional if user is already logged in

    // Birth Data
    birthDate: string;
    birthTime: string;
    birthCity: string;
    gender: 'male' | 'female';

    // Agreements
    agreedToTerms: boolean;
    agreedToTnc: boolean;
}

interface UnifiedCheckoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: UnifiedCheckoutData) => Promise<void>;
    isLoading: boolean;
    user: any; // User object from supabase
    skipBirthData?: boolean; // Skip birth data input (for saved charts)
    prefillBirthData?: {
        birthDate: string;
        birthTime: string;
        birthCity: string;
        gender: 'male' | 'female';
    };
}

export function UnifiedCheckoutModal({
    open,
    onOpenChange,
    onSubmit,
    isLoading,
    user,
    skipBirthData = false,
    prefillBirthData
}: UnifiedCheckoutModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

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

    // Pre-fill data if user exists
    useEffect(() => {
        if (user && open) {
            if (user.user_metadata?.name) setName(user.user_metadata.name);
            if (user.email) setEmail(user.email);
            if (user.user_metadata?.whatsapp) setWhatsapp(user.user_metadata.whatsapp);
        }
        // Pre-fill birth data if provided (for saved charts)
        if (prefillBirthData && open) {
            setBirthDate(prefillBirthData.birthDate);
            setBirthTime(prefillBirthData.birthTime);
            setCitySearch(prefillBirthData.birthCity);
            setSelectedCity({
                display_name: prefillBirthData.birthCity,
                lat: '0',
                lon: '0'
            });
            setGender(prefillBirthData.gender);
        }
    }, [user, open, prefillBirthData]);

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

    const handleGoogleLogin = async () => {
        setAuthLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + window.location.pathname,
            },
        });

        if (error) {
            toast({
                title: "Gagal login dengan Google",
                description: error.message,
                variant: "destructive"
            });
            setAuthLoading(false);
        }
    };

    const isFormValid = () => {
        const isPersonalValid = !!(name && email && whatsapp && user);
        const isBirthValid = skipBirthData || !!(birthDate && birthTime && selectedCity);
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
                title: "Data belum lengkap",
                description: "Mohon lengkapi semua data yang diperlukan",
                variant: "destructive"
            });
            return;
        }

        // Use full display_name - N8N needs complete address for geocoding
        // Example: "Pati, Jawa Tengah, Jawa, Indonesia"
        const birthCity = selectedCity?.display_name || '';

        if (!user) {
            toast({
                title: "Belum Login",
                description: "Mohon login dengan Google terlebih dahulu untuk melanjutkan.",
                variant: "destructive"
            });
            return;
        }

        await onSubmit({
            name,
            email,
            whatsapp,
            birthDate,
            birthTime,
            birthCity,
            gender,
            agreedToTerms,
            agreedToTnc
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
                        Lengkapi data di bawah untuk mendapatkan Full Report kamu.
                    </DialogDescription>
                </div>

                <div className="p-6 space-y-8">
                    {/* Section 1: Akun & Kontak */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</div>
                            <h3 className="font-semibold text-foreground">Akun & Kontak</h3>
                        </div>

                        {!user ? (
                            <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl text-center space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Masuk dengan Google untuk amankan report kamu secara otomatis.
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full bg-white hover:bg-white/90 text-[hsl(160_84%_5%)] h-12 rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-sm border-none"
                                    onClick={handleGoogleLogin}
                                    disabled={authLoading}
                                >
                                    {authLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    fill="#EA4335"
                                                />
                                            </svg>
                                            Masuk dengan Google
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nama Lengkap</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Nama kamu"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Nomor WhatsApp</Label>
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

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            placeholder="email@kamu.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={!!user?.email}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Section 2: Data Kelahiran */}
                    {!skipBirthData && (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">2</div>
                                <h3 className="font-semibold text-foreground">Data Kelahiran (Untuk Analisis)</h3>
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
                                            className="pl-9 bg-background/50" // iOS Safari fix usually needs simpler inputs but styling ok
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
                                    <p className="text-[10px] text-muted-foreground ml-1">Gunakan perkiraan jika tidak tahu pasti</p>
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

                            <div className="space-y-2">
                                <Label>Jenis Kelamin</Label>
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
                                <div className="text-xl font-bold text-accent">{formatPrice(PRODUCTS.FULL_REPORT.price)}</div>
                                <div className="text-xs text-muted-foreground line-through">{formatPrice(PRODUCTS.FULL_REPORT.original_price)}</div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2 border-t border-border/50">
                            {/* Add-on Section - Optional Teasers */}
                            <div className="pb-2">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="addons" className="border-b-0">
                                        <AccordionTrigger className="hover:no-underline py-2">
                                            <div className="flex items-center gap-2 opacity-50">
                                                <h3 className="font-medium text-muted-foreground text-left text-xs">💡 Lihat Add-on yang akan datang (opsional)</h3>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-[10px] text-muted-foreground mb-3 italic">
                                                Fitur tambahan ini sedang dalam pengembangan. Kamu bisa lanjut checkout tanpa ini.
                                            </p>
                                            <div className="grid grid-cols-1 gap-3 pt-2 pb-2">
                                                <div className="flex items-center justify-between p-3 border border-dashed border-border/40 rounded-lg bg-secondary/5 opacity-50 cursor-not-allowed">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-background/50 rounded-md">
                                                            <ScrollText className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-foreground/70">Bazi Chart Analysis</p>
                                                            <p className="text-[10px] text-muted-foreground">Detail elemen keberuntungan</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-medium px-2 py-1 bg-secondary/50 rounded-full text-secondary-foreground/70">Segera Hadir</span>
                                                </div>

                                                <div className="flex items-center justify-between p-3 border border-dashed border-border/40 rounded-lg bg-secondary/5 opacity-50 cursor-not-allowed">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-background/50 rounded-md">
                                                            <HeartHandshake className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-foreground/70">Relationship Chart</p>
                                                            <p className="text-[10px] text-muted-foreground">Kecocokan pasangan</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-medium px-2 py-1 bg-secondary/50 rounded-full text-secondary-foreground/70">Segera Hadir</span>
                                                </div>

                                                <div className="flex items-center justify-between p-3 border border-dashed border-border/40 rounded-lg bg-secondary/5 opacity-50 cursor-not-allowed">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-background/50 rounded-md">
                                                            <Baby className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-foreground/70">Parenting Chart</p>
                                                            <p className="text-[10px] text-muted-foreground">Panduan mengasuh anak</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-medium px-2 py-1 bg-secondary/50 rounded-full text-secondary-foreground/70">Segera Hadir</span>
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
                                        Data kelahiran saya sudah benar (Akurasi report bergantung pada data ini)
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
