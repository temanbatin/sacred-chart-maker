export const PRICING_CONFIG = {
    REPORT_PRICE: 249000, // Full Bundle Premium
    ORIGINAL_PRICE: 750000, // Legacy support
    CURRENCY: 'IDR',
    LOCALE: 'id-ID'
};

export const PRODUCTS = {
    // Main Product - Full Bundle Premium (HD + Bazi + Audio + WA AI)
    FULL_REPORT: {
        id: 'bundle-full-bazi',
        name: 'Full Bundle Premium (Human Design + Bazi)',
        price: 249000,
        original_price: 750000,
        report_type: 'bundle-full-bazi',
        features: [
            '📖 Human Design Report (100+ Halaman)',
            '📊 Bazi Report Lengkap (30+ Halaman)',
            '🎧 Audio Summary Report (15-20 Menit)',
            '🤖 BONUS: 30 Hari Kira AI Mentor',
            'Tipe, Strategi & Otoritas',
            'Incarnation Cross (Misi Hidup)',
            'Analisis 9 Energy Center',
            'Day Master & 5 Elemen Bazi',
            'Luck Pillars (Siklus Keberuntungan)',
            'Panduan Karir, Relasi & Kesehatan'
        ]
    },
    // Bazi Only - For users who only want Bazi
    BAZI_ONLY: {
        id: 'bazi-only',
        name: 'Bazi Report Only',
        price: 149000,
        original_price: 300000,
        report_type: 'bazi',
        features: [
            '📊 Bazi Report Lengkap (30+ Halaman)',
            '🤖 BONUS: 30 Hari Kira AI Mentor',
            'Analisis Day Master',
            'Prakiraan Keberuntungan (Luck Pillars)',
            'Analisis Karir & Kekayaan',
            'Kekuatan & Kelemahan Elemen',
            'Tanpa Human Design Report'
        ]
    },
    // WhatsApp AI Subscription - Alumni Only
    WHATSAPP_KIRA_SUBSCRIPTION: {
        id: 'whatsapp-kira-subscription',
        name: 'Kira AI Mentor (Bulanan)',
        price: 49000,
        original_price: 150000,
        report_type: null,
        features: [
            'Unlimited Chat 24/7',
            'Custom AI Sesuai Bazi dan Human Design-mu',
            'Tanya seputar kehidupan sesuai hari',
            'Ruang aman (privasi terjaga)'
        ],
        eligibility: 'alumni-only' // Must have purchased report before
    },
    // Legacy alias for backwards compatibility
    BAZI_REPORT: {
        id: 'bundle-full-bazi',
        name: 'Full Bundle Premium (Human Design + Bazi)',
        price: 249000,
        original_price: 750000,
        report_type: 'bundle-full-bazi',
        features: [
            '📖 Human Design Report (100+ Halaman)',
            '📊 Bazi Report Lengkap (30+ Halaman)',
            '🎧 Audio Summary Report (15-20 Menit)',
            '🤖 BONUS: 30 Hari Kira AI Mentor'
        ]
    }
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat(PRICING_CONFIG.LOCALE, {
        style: 'currency',
        currency: PRICING_CONFIG.CURRENCY,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export const getDiscountPercentage = () => {
    return Math.round(((PRICING_CONFIG.ORIGINAL_PRICE - PRICING_CONFIG.REPORT_PRICE) / PRICING_CONFIG.ORIGINAL_PRICE) * 100);
};
export const MARKETING_CONFIG = {
    REMAINING_SLOTS: 8
};

export const COUPONS: Record<string, { type: 'fixed' | 'percent', value: number }> = {
    'HEMAT50': { type: 'fixed', value: 50000 },
    'TEMANBATIN': { type: 'percent', value: 10 }, // 10% off
    'LAUNCH': { type: 'fixed', value: 99000 }, // Special price reduction
};
