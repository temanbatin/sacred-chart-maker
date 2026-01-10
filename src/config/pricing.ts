export const PRICING_CONFIG = {
    REPORT_PRICE: 199000,
    ORIGINAL_PRICE: 500000,
    CURRENCY: 'IDR',
    LOCALE: 'id-ID'
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
