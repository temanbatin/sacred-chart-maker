import { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, MapPin, Loader2, Calendar, Clock, ArrowRight, ArrowLeft, CheckCircle, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface City {
    display_name: string;
    lat: string;
    lon: string;
}

interface MultiStepFormProps {
    onSubmit: (data: BirthData) => void;
    isLoading: boolean;
}

export interface BirthData {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    place: string;
    // Optional fields collected in step 2
    whatsapp?: string;
    email?: string;
    // These may be added later during checkout
    name?: string;
    gender?: 'male' | 'female';
}

const TOTAL_STEPS = 2;

export const MultiStepForm = forwardRef<HTMLDivElement, MultiStepFormProps>(({
    onSubmit,
    isLoading
}, ref) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1: Birth Data
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [citySuggestions, setCitySuggestions] = useState<City[]>([]);

    // Step 2: Contact Info
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');

    // Spam Protection
    const [honeypot, setHoneypot] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // City autocomplete with OpenStreetMap Nominatim
    const searchCities = useCallback(async (query: string) => {
        if (query.length < 3) {
            setCitySuggestions([]);
            return;
        }
        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
            if (!response.ok) {
                throw new Error('Gagal mengambil data kota');
            }
            const data = await response.json();
            setCitySuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error searching cities:', error);
            toast.error("Gagal mencari kota. Silakan periksa koneksi internet kamu.");
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        if (citySearch && !selectedCity) {
            debounceRef.current = setTimeout(() => {
                searchCities(citySearch);
            }, 300);
        }
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [citySearch, selectedCity, searchCities]);

    const handleCitySelect = (city: City) => {
        setSelectedCity(city);
        setCitySearch(city.display_name);
        setShowSuggestions(false);
    };

    const canProceedToStep2 = birthDate && birthTime && selectedCity !== null;
    const canSubmit = whatsapp.length >= 10 || email.includes('@');

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Spam Check
        if (honeypot) {
            return;
        }

        if (!selectedCity || !birthDate || !birthTime) {
            toast.error("Mohon lengkapi data kelahiran");
            return;
        }

        if (!whatsapp && !email) {
            toast.error("Mohon isi minimal WhatsApp atau Email");
            return;
        }

        const [year, month, day] = birthDate.split('-').map(Number);
        const [hour, minute] = birthTime.split(':').map(Number);

        if (!year || !month || !day || hour === undefined || minute === undefined) {
            toast.error("Data tanggal atau waktu tidak valid");
            return;
        }

        const finalData: BirthData = {
            year,
            month,
            day,
            hour,
            minute,
            place: selectedCity.display_name,
            whatsapp: whatsapp || undefined,
            email: email || undefined
        };

        onSubmit(finalData);
    };

    // Handle Enter key to proceed to next step
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentStep === 1 && canProceedToStep2) {
                handleNext();
            }
        }
    };

    return (
        <section ref={ref} className="pt-10 pb-20 px-4" id="calculator">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-gradient-fire my-px">
                    Siap Melihat Siapa Dirimu yang Sebenarnya?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground text-center mb-8">
                    Hanya butuh 1 menit untuk mendapatkan wawasan yang bisa mengubah caramu memandang hidup selamanya.
                </p>

                {/* Centered Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-center items-center gap-0">
                        {/* Step 1 */}
                        <div className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                                    ${currentStep > 1
                                        ? 'bg-primary text-primary-foreground'
                                        : currentStep === 1
                                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                                            : 'bg-secondary text-muted-foreground'
                                    }`}
                            >
                                {currentStep > 1 ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    '1'
                                )}
                            </div>
                        </div>

                        {/* Connecting Line */}
                        <div
                            className={`w-16 sm:w-24 md:w-32 h-1 transition-all
                                ${currentStep > 1 ? 'bg-primary' : 'bg-secondary'}`}
                        />

                        {/* Step 2 */}
                        <div className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                                    ${currentStep === 2
                                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                                        : 'bg-secondary text-muted-foreground'
                                    }`}
                            >
                                2
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10">
                    {/* Step 1: Birth Data */}
                    {currentStep === 1 && (
                        <>
                            <div className="text-center mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                                    Kapan & Dimana Kamu Lahir?
                                </h3>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Data ini menentukan akurasi chart-mu
                                </p>
                            </div>

                            <div className="space-y-5 animate-fade-up">
                                {/* Date & Time Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="birthDate" className="text-foreground text-base">
                                            Tanggal Lahir
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="birthDate"
                                                type="date"
                                                value={birthDate}
                                                onChange={e => setBirthDate(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                className="hd-date relative bg-input border-border text-foreground h-12 rounded-xl pr-10 text-base"
                                            />
                                            <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="birthTime" className="text-foreground text-base">
                                            Waktu Lahir
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="birthTime"
                                                type="time"
                                                value={birthTime}
                                                onChange={e => setBirthTime(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                className="hd-time relative bg-input border-border text-foreground h-12 rounded-xl pr-10 text-base"
                                            />
                                            <Clock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Jika tidak tahu waktu pasti, gunakan perkiraan terdekat
                                        </p>
                                    </div>
                                </div>

                                {/* City Search */}
                                <div className="space-y-2 relative">
                                    <Label htmlFor="city" className="text-foreground text-base">
                                        Kota Kelahiran
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="city"
                                            type="text"
                                            placeholder="Ketik min. 3 huruf..."
                                            value={citySearch}
                                            onChange={e => {
                                                setCitySearch(e.target.value);
                                                setSelectedCity(null);
                                            }}
                                            onFocus={() => citySuggestions.length > 0 && setShowSuggestions(true)}
                                            className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl pl-10 text-base"
                                        />
                                        {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />}
                                    </div>

                                    {/* Suggestions dropdown */}
                                    {showSuggestions && citySuggestions.length > 0 && (
                                        <div className="z-20 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                                            {citySuggestions.map((city, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleCitySelect(city)}
                                                    className="w-full text-left px-4 py-3 hover:bg-secondary text-foreground text-sm transition-colors border-b border-border last:border-0"
                                                >
                                                    {city.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedCity && (
                                    <div className="bg-primary/10 rounded-xl p-4 flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm text-muted-foreground">Kota terpilih:</p>
                                            <p className="text-foreground font-medium truncate">{selectedCity.display_name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Step 2: Contact Info */}
                    {currentStep === 2 && (
                        <>
                            <div className="text-center mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                                    Kemana Kami Bisa Menghubungimu?
                                </h3>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Isi minimal salah satu untuk menerima chart-mu
                                </p>
                            </div>

                            <div className="space-y-5 animate-fade-up">
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className="text-foreground text-base">
                                        Nomor WhatsApp
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="whatsapp"
                                            type="tel"
                                            placeholder="08123456789"
                                            value={whatsapp}
                                            onChange={e => setWhatsapp(e.target.value)}
                                            className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl pl-10 text-base"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground text-base">
                                        Alamat Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="nama@email.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl pl-10 text-base"
                                        />
                                    </div>
                                </div>

                                <p className="text-xs text-muted-foreground text-center">
                                    Data ini akan tersimpan saat checkout agar tidak perlu mengisi ulang
                                </p>
                            </div>
                        </>
                    )}

                    {/* Honeypot Field (Hidden) - Anti-Spam */}
                    <div className="absolute opacity-0 -z-50 pointer-events-none" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
                        <label htmlFor="website-field">Website</label>
                        <input
                            type="text"
                            id="website-field"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                        />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-3 mt-8 sm:mt-10">
                        {currentStep > 1 ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={handleBack}
                                className="rounded-xl"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Button>
                        ) : (
                            <div></div>
                        )}

                        {currentStep < TOTAL_STEPS ? (
                            <Button
                                type="button"
                                size="lg"
                                onClick={handleNext}
                                disabled={!canProceedToStep2}
                                className="fire-glow bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-sm sm:text-base px-4 sm:px-6"
                            >
                                Lanjut
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isLoading || !canSubmit}
                                className="fire-glow bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 rounded-xl font-semibold disabled:opacity-50 w-auto"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                                        <span className="whitespace-nowrap">Menghitung...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                        <span className="whitespace-nowrap">Lihat Desainku</span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
});

MultiStepForm.displayName = 'MultiStepForm';
