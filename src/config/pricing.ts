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
    },
    ESSENTIAL_REPORT: {
        id: 'essential_report',
        name: 'Essential Human Design Report',
        price: 120000,
        original_price: 250000,
        features: [
            'Basic Profile (Tipe, Strategi, Otoritas)',
            'Analisis Profil (ex: 1/3, 4/6)',
            'Signature & Not-Self Theme',
            'Personalized Synthesis (Ringkasan Kekuatan)',
            'Dokumen PDF Ringkas (~15 Halaman)'
        ]
    },
    UPGRADE_ESSENTIAL: {
        id: 'upgrade_essential',
        name: 'Upgrade to Full Report',
        price: 100000,
        original_price: 199000,
        features: [
            'Upgrade dari Essential ke Full',
            'Analisis Mendalam (+80 Halaman)',
            'Semua fitur Full Report',
            'Incarnation Cross & Gates',
            'Panduan Relasi & Karir'
        ]
    },
    BAZI_ADDON: {
        id: 'bazi_addon',
        name: 'Bazi Report Add-on',
        price: 50000,
        original_price: 150000,
        features: [
            'Analisis Elemen Diri (Day Master)',
            'Kekuatan & Kelemahan Elemen',
            'Keberuntungan Tahunan (General)'
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
