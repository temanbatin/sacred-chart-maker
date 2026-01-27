export const PRICING_CONFIG = {
    REPORT_PRICE: 199000, // Legacy support (Full Report)
    ORIGINAL_PRICE: 500000, // Legacy support
    CURRENCY: 'IDR',
    LOCALE: 'id-ID'
};

export const PRODUCTS = {
    FULL_REPORT: {
        id: 'full_report',
        name: 'Full Report Human Design',
        price: 199000,
        original_price: 500000,
        features: [
            'Analisis Mendalam (100+ Halaman)',
            'Termasuk: Bazi Chart Analysis (Weather Report)',
            'BONUS: 30 Hari Kira AI Mentor (Gratis)',
            'Tipe, Strategi & Otoritas',
            'Incarnation Cross (Misi Hidup)',
            'Analisis 9 Energy Center',
            'Panduan Karir & Relasi',
            'Peta Potensi Tersembunyi',
            'Tips Kesehatan & Vitalitas'
        ]
    },
    BAZI_REPORT: {
        id: 'bazi_report',
        name: 'Bazi + Human Design Full Report Bundle',
        price: 299000,
        original_price: 750000,
        features: [
            'Includes EVERYTHING in Full HD Report',
            'Analisis Elemen Diri (Day Master)',
            'Prakiraan Keberuntungan (Luck Pillars)',
            'Analisis Karir & Kekayaan (Wealth Element)',
            'Harmoni Hubungan (Compatibility)',
            'Strategi Tahunan (Annual Forecast)',
            'Kekuatan & Kelemahan Elemen'
        ]
    },
    BAZI_ONLY: {
        id: 'bazi_only',
        name: 'Bazi Chart Analysis Only',
        price: 149000,
        original_price: 300000,
        features: [
            'Includes: 30 Hari Kira AI Mentor (Gratis)',
            'Analisis Elemen Diri (Day Master)',
            'Prakiraan Keberuntungan (Luck Pillars)',
            'Analisis Karir & Kekayaan (Wealth Element)',
            'Kekuatan & Kelemahan Elemen',
            'Tanpa Human Design Report'
        ]
    },
    WHATSAPP_KIRA_SUBSCRIPTION: {
        id: 'whatsapp_kira_subscription',
        name: 'Kira AI Mentor Subscription (Monthly)',
        price: 49000,
        original_price: 150000,
        features: [
            'Unlimited Chat 24/7',
            'Personalisasi Human Design & Bazi',
            'Daily Energy Updates',
            'Privacy First (Ruang Aman)',
            'Cancel Anytime'
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
