import { useState, useEffect } from 'react';
import { Eye, ShoppingBag } from 'lucide-react';

// Indonesian first names for believable purchase notifications
const FIRST_NAMES = [
    'Andi', 'Budi', 'Citra', 'Dewi', 'Eka', 'Fitri', 'Gita', 'Hendra',
    'Indah', 'Joko', 'Kartika', 'Lina', 'Maya', 'Nadia', 'Putri', 'Rani',
    'Sari', 'Tika', 'Udin', 'Vina', 'Wati', 'Yuni', 'Zahra', 'Ayu',
    'Bayu', 'Dian', 'Fajar', 'Gilang', 'Hana', 'Irwan', 'Kiki', 'Luki'
];

// Cities for realistic location display
const CITIES = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar',
    'Yogyakarta', 'Denpasar', 'Palembang', 'Tangerang', 'Bekasi', 'Depok'
];

// Get random item from array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Get random number between min and max
const getRandomNumber = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

interface LiveSocialProofProps {
    className?: string;
}

export const LiveSocialProof = ({ className }: LiveSocialProofProps) => {
    const [viewerCount, setViewerCount] = useState(getRandomNumber(3, 12));
    const [recentPurchase, setRecentPurchase] = useState<{ name: string; city: string; time: string } | null>(null);
    const [showPurchase, setShowPurchase] = useState(false);

    // Randomly fluctuate viewer count every 8-15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setViewerCount(prev => {
                const change = getRandomNumber(-2, 3);
                const newValue = prev + change;
                return Math.max(2, Math.min(18, newValue)); // Keep between 2-18
            });
        }, getRandomNumber(8000, 15000));

        return () => clearInterval(interval);
    }, []);

    // Show random purchase notification every 30-90 seconds
    useEffect(() => {
        const showRandomPurchase = () => {
            const name = getRandomItem(FIRST_NAMES);
            const city = getRandomItem(CITIES);
            const minutesAgo = getRandomNumber(1, 15);

            setRecentPurchase({
                name,
                city,
                time: minutesAgo === 1 ? '1 menit lalu' : `${minutesAgo} menit lalu`
            });
            setShowPurchase(true);

            // Hide after 5 seconds
            setTimeout(() => setShowPurchase(false), 5000);
        };

        // Show initial purchase after 5-10 seconds
        const initialTimeout = setTimeout(showRandomPurchase, getRandomNumber(5000, 10000));

        // Then show every 30-90 seconds
        const interval = setInterval(showRandomPurchase, getRandomNumber(30000, 90000));

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={className}>
            {/* Viewer count - always visible */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                <Eye className="w-3 h-3" />
                <span>{viewerCount} orang sedang melihat ini</span>
            </div>

            {/* Recent purchase notification - animated in/out */}
            {showPurchase && recentPurchase && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 animate-fade-up">
                    <ShoppingBag className="w-3 h-3" />
                    <span>
                        <strong>{recentPurchase.name}</strong> dari {recentPurchase.city} baru saja membeli Full Report • {recentPurchase.time}
                    </span>
                </div>
            )}
        </div>
    );
};
