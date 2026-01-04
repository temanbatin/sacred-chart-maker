import { useState, useCallback, forwardRef, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, MapPin, Loader2 } from 'lucide-react';

interface City {
  display_name: string;
  lat: string;
  lon: string;
}

interface CalculatorFormProps {
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

export const CalculatorForm = forwardRef<HTMLDivElement, CalculatorFormProps>(
  ({ onSubmit, isLoading }, ref) => {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [citySearch, setCitySearch] = useState('');
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
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
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
        );
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

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedCity || !birthDate || !birthTime) {
        return;
      }

      const [year, month, day] = birthDate.split('-').map(Number);
      const [hour, minute] = birthTime.split(':').map(Number);

      onSubmit({
        name,
        year,
        month,
        day,
        hour,
        minute,
        place: selectedCity.display_name,
        gender,
      });
    };

    return (
      <section ref={ref} className="py-20 px-4" id="calculator">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gradient-fire">
            Hitung Chart Human Design-mu
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Masukkan data kelahiranmu dengan akurat untuk hasil yang tepat
          </p>

          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 md:p-12 space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground text-lg">
                Nama Lengkap
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkapmu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl"
                required
              />
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-foreground text-lg">
                Tanggal Lahir
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="bg-input border-border text-foreground h-12 rounded-xl"
                required
              />
            </div>

            {/* Birth Time */}
            <div className="space-y-2">
              <Label htmlFor="birthTime" className="text-foreground text-lg">
                Waktu Lahir
              </Label>
              <Input
                id="birthTime"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="bg-input border-border text-foreground h-12 rounded-xl"
                required
              />
              <p className="text-sm text-muted-foreground">
                Jika tidak tahu waktu pasti, gunakan perkiraan terdekat
              </p>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <Label className="text-foreground text-lg">Jenis Kelamin</Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as 'male' | 'female')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" className="border-primary text-primary" />
                  <Label htmlFor="male" className="text-foreground cursor-pointer">
                    Pria
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" className="border-primary text-primary" />
                  <Label htmlFor="female" className="text-foreground cursor-pointer">
                    Wanita
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* City Autocomplete */}
            <div className="space-y-2 relative">
              <Label htmlFor="city" className="text-foreground text-lg">
                Kota Kelahiran
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="city"
                  type="text"
                  placeholder="Ketik nama kota..."
                  value={citySearch}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setSelectedCity(null);
                  }}
                  onFocus={() => citySuggestions.length > 0 && setShowSuggestions(true)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl pl-10"
                  required
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
                )}
              </div>

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

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !selectedCity}
              className="w-full fire-glow bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-xl font-semibold disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Menghitung...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Lihat Desainku
                </>
              )}
            </Button>
          </form>
        </div>
      </section>
    );
  }
);

CalculatorForm.displayName = 'CalculatorForm';
