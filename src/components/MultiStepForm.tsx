import { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, MapPin, Loader2, Calendar, Clock, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { birthDataSchema, type BirthDataInput } from '@/lib/validation';
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
    name: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    place: string;
    gender: 'male' | 'female';
}

const TOTAL_STEPS = 3;

export const MultiStepForm = forwardRef<HTMLDivElement, MultiStepFormProps>(({
    onSubmit,
    isLoading
}, ref) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1: Nama + Gender
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');

    // Step 2: Tanggal + Waktu Lahir
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');

    // Step 3: Kota
    const [citySearch, setCitySearch] = useState('');
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [citySuggestions, setCitySuggestions] = useState<City[]>([]);

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
            const data = await response.json();
            setCitySuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error searching cities:', error);
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

    const canProceedToStep2 = name.trim().length > 0;
    const canProceedToStep3 = birthDate && birthTime;
    const canSubmit = selectedCity !== null;

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
            // Bot detected
            return;
        }

        if (!selectedCity || !birthDate || !birthTime) {
            toast.error("Mohon lengkapi semua data");
            return;
        }

        const [year, month, day] = birthDate.split('-').map(Number);
        const [hour, minute] = birthTime.split(':').map(Number);

        const formData = {
            name,
            year,
            month,
            day,
            hour,
            minute,
            place: selectedCity.display_name,
            gender,
            honeypot // should be empty string
        };

        const result = birthDataSchema.safeParse(formData);

        if (!result.success) {
            const errorMsg = result.error.errors[0]?.message || "Data tidak valid";
            toast.error(errorMsg);
            return;
        }

        // Clean valid data (omit honeypot)
        const validData = result.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { honeypot: _, ...finalData } = validData;

        onSubmit(finalData as BirthData);
    };

    // Handle Enter key to proceed to next step
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentStep === 1 && canProceedToStep2) {
                handleNext();
            } else if (currentStep === 2 && canProceedToStep3) {
                handleNext();
            }
            // Step 3 uses form submit
        }
    };

    const getStepTitle = (step: number) => {
        switch (step) {
            case 1: return 'Siapa Namamu?';
            case 2: return 'Kapan Kamu Lahir?';
            case 3: return 'Dimana Kamu Lahir?';
            default: return '';
        }
    };

    const getStepDescription = (step: number) => {
        switch (step) {
            case 1: return 'Masukkan nama dan jenis kelaminmu';
            case 2: return 'Waktu lahir mempengaruhi akurasi chart';
            case 3: return 'Kota kelahiranmu menentukan zona waktu';
            default: return '';
        }
    };

    return (
        <section ref={ref} className="py-20 px-4" id="calculator">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-gradient-fire my-px">
                    Siap Melihat Siapa Dirimu yang Sebenarnya?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground text-center mb-8">
                    Hanya butuh 1 menit untuk mendapatkan wawasan yang bisa mengubah caramu memandang hidup selamanya.
                </p>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                    ${currentStep > step
                                            ? 'bg-primary text-primary-foreground'
                                            : currentStep === step
                                                ? 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                                                : 'bg-secondary text-muted-foreground'
                                        }`}
                                >
                                    {currentStep > step ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        step
                                    )}
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`w-16 sm:w-24 md:w-32 h-1 mx-2 rounded transition-all
                      ${currentStep > step ? 'bg-primary' : 'bg-secondary'}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-12">
                    {/* Step Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                            {getStepTitle(currentStep)}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {getStepDescription(currentStep)}
                        </p>
                    </div>

                    {/* Step 1: Nama + Gender */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-fade-up">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground text-lg">
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Masukkan nama lengkapmu"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="bg-input border-border text-foreground placeholder:text-muted-foreground h-14 rounded-xl text-lg"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-foreground text-lg">Jenis Kelamin</Label>
                                <RadioGroup
                                    value={gender}
                                    onValueChange={value => setGender(value as 'male' | 'female')}
                                    className="flex gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="male" id="male" className="border-primary text-primary" />
                                        <Label htmlFor="male" className="text-foreground cursor-pointer text-lg">
                                            Pria
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="female" id="female" className="border-primary text-primary" />
                                        <Label htmlFor="female" className="text-foreground cursor-pointer text-lg">
                                            Wanita
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Tanggal + Waktu Lahir */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-fade-up">
                            <div className="space-y-2">
                                <Label htmlFor="birthDate" className="text-foreground text-lg">
                                    Tanggal Lahir
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        value={birthDate}
                                        onChange={e => setBirthDate(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="hd-date relative bg-input border-border text-foreground h-14 rounded-xl pr-10 text-lg"
                                    />
                                    <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birthTime" className="text-foreground text-lg">
                                    Waktu Lahir
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="birthTime"
                                        type="time"
                                        value={birthTime}
                                        onChange={e => setBirthTime(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="hd-time relative bg-input border-border text-foreground h-14 rounded-xl pr-10 text-lg"
                                    />
                                    <Clock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Jika tidak tahu waktu pasti, gunakan perkiraan terdekat
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Kota */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fade-up">
                            <div className="space-y-2 relative">
                                <Label htmlFor="city" className="text-foreground text-lg">
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
                                        className="bg-input border-border text-foreground placeholder:text-muted-foreground h-14 rounded-xl pl-10 text-lg"
                                    />
                                    {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />}
                                </div>
                                <p className="text-xs text-muted-foreground pl-1">
                                    {citySearch.length > 0 && citySearch.length < 3
                                        ? "Ketikan minimal 3 huruf..."
                                        : "Tunggu sebentar, daftar kota akan muncul otomatis."}
                                </p>

                                {/* Suggestions dropdown */}
                                {showSuggestions && citySuggestions.length > 0 && (
                                    <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
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
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Kota terpilih:</p>
                                        <p className="text-foreground font-medium">{selectedCity.display_name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
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
                                disabled={
                                    (currentStep === 1 && !canProceedToStep2) ||
                                    (currentStep === 2 && !canProceedToStep3)
                                }
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
