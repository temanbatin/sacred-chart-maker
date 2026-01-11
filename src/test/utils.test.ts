import { describe, it, expect } from 'vitest';

/**
 * Utility functions tests
 * These tests verify basic utility functions work correctly
 */

describe('String Utilities', () => {
    describe('Phone number formatting', () => {
        it('should format Indonesian phone numbers correctly', () => {
            const formatPhone = (phone: string): string => {
                if (!phone) return '';
                let digits = phone.replace(/\D/g, '');
                if (digits.startsWith('62')) {
                    digits = '0' + digits.substring(2);
                }
                if (!digits.startsWith('0')) {
                    digits = '0' + digits;
                }
                return digits;
            };

            expect(formatPhone('+6281234567890')).toBe('081234567890');
            expect(formatPhone('6281234567890')).toBe('081234567890');
            expect(formatPhone('081234567890')).toBe('081234567890');
            expect(formatPhone('81234567890')).toBe('081234567890');
        });
    });

    describe('Email validation', () => {
        it('should validate email format', () => {
            const isValidEmail = (email: string): boolean => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            };

            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.co.id')).toBe(true);
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('missing@domain')).toBe(false);
            expect(isValidEmail('@nodomain.com')).toBe(false);
        });
    });
});

describe('Price Utilities', () => {
    it('should calculate discount percentage correctly', () => {
        const calculateDiscount = (original: number, discounted: number): number => {
            return Math.round(((original - discounted) / original) * 100);
        };

        expect(calculateDiscount(500000, 299000)).toBe(40);
        expect(calculateDiscount(100, 75)).toBe(25);
        expect(calculateDiscount(100, 100)).toBe(0);
    });

    it('should format price in Indonesian Rupiah', () => {
        const formatPrice = (amount: number): string => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
        };

        expect(formatPrice(299000)).toContain('299.000');
        expect(formatPrice(1500000)).toContain('1.500.000');
    });
});

describe('Date Utilities', () => {
    it('should format date in Indonesian locale', () => {
        const formatDate = (dateStr: string): string => {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        };

        // Note: Month names may vary based on locale data
        const result = formatDate('2026-01-11');
        expect(result).toContain('2026');
        expect(result).toContain('11');
    });

    it('should format time correctly', () => {
        const formatTime = (timeStr: string | null): string => {
            if (!timeStr) return '-';
            const [hour, minute] = timeStr.split(':');
            return `${hour}:${minute}`;
        };

        expect(formatTime('14:30:00')).toBe('14:30');
        expect(formatTime('09:05:00')).toBe('09:05');
        expect(formatTime(null)).toBe('-');
    });
});
