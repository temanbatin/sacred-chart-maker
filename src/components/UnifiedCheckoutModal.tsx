import { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    User, Mail, Phone, Lock, Calendar, Clock, MapPin,
    Loader2, CreditCard, ChevronRight, CheckCircle2, Shield
} from 'lucide-react';
import { formatPrice } from '@/config/pricing';
import { PRODUCTS } from '@/config/pricing';
import { toast } from '@/hooks/use-toast';

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
    // Personal Data State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [password, setPassword] = useState('');

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

    // City Autocomplete Logic (Duplicated from CalculatorForm to ensure isolation)
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
        const isPersonalValid = name && email && whatsapp && (user || password.length >= 6);
        const isBirthValid = skipBirthData || (birthDate && birthTime && selectedCity); // skip check if skipBirthData
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

        console.log("========================================");
        console.log("🔍 CITY STRING BEING SENT:", birthCity);
        console.log("========================================");

        await onSubmit({
            name,
            email,
            whatsapp,
            password: user ? undefined : password,
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
                    {/* Section 1: Data Akun & Kontak */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</div>
                            <h3 className="font-semibold text-foreground">Data Akun & Kontak</h3>
                        </div>

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

                            {!user && (
                                <div className="space-y-2">
                                    <Label>Password (untuk login nanti)</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="Minimal 6 karakter"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
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
                                        <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden max-h-40 overflow-y-auto">
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
                                <p className="text-xs text-muted-foreground">Human Design + Bazi (100+ Halaman)</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-accent">{formatPrice(PRODUCTS.FULL_REPORT.price)}</div>
                                <div className="text-xs text-muted-foreground line-through">{formatPrice(PRODUCTS.FULL_REPORT.original_price)}</div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2 border-t border-border/50">
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
                                Bayar & Dapatkan Report
                                <Shield className="w-5 h-5 ml-2 opacity-80" />
                            </>
                        )}
                    </Button>
                    <div className="text-center mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        <span>Garansi 100% Uang Kembali jika report error</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
