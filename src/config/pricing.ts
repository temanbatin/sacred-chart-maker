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
            'Tipe, Strategi & Otoritas',
            'Incarnation Cross (Misi Hidup)',
            'Analisis 9 Energy Center',
            'Panduan Karir & Relasi',
            'Peta Potensi Tersembunyi',
            'Tips Kesehatan & Vitalitas',
            'Variable (Digestion, Environment, Motivation)'
        ]
    }
    // NOTE: Add-ons (Bazi, Relationship, Parenting) akan ditambahkan ketika fiturnya siap
    // Lihat UnifiedCheckoutModal.tsx untuk "Coming Soon" placeholders
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
