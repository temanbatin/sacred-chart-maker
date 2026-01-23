/**
 * Helper functions for checkout flow
 */

export interface StandardBirthData {
    name: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    place: string;
    gender: 'male' | 'female';
}

/**
 * Format birth data to standard metadata format
 * Converts various input formats to consistent structure for order metadata
 * 
 * @param input - Birth data from form or existing data
 * @returns Standardized birth data with numbers for date/time fields
 */
export function formatBirthDataForMetadata(input: {
    name: string;
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    place?: string;
    birthDate?: string;  // Format: YYYY-MM-DD
    birthTime?: string;  // Format: HH:mm
    birthCity?: string;
    gender: 'male' | 'female';
}): StandardBirthData {
    let year: number, month: number, day: number;
    let hour: number, minute: number;

    // Parse date - accept either individual fields or date string
    if (input.birthDate) {
        const parts = input.birthDate.split('-').map(Number);
        year = parts[0];
        month = parts[1];
        day = parts[2];
    } else if (input.year !== undefined && input.month !== undefined && input.day !== undefined) {
        year = input.year;
        month = input.month;
        day = input.day;
    } else {
        throw new Error('Birth date is required (either as birthDate string or year/month/day)');
    }

    // Parse time - accept either individual fields or time string
    if (input.birthTime) {
        const parts = input.birthTime.split(':').map(Number);
        hour = parts[0];
        minute = parts[1];
    } else if (input.hour !== undefined && input.minute !== undefined) {
        hour = input.hour;
        minute = input.minute;
    } else {
        throw new Error('Birth time is required (either as birthTime string or hour/minute)');
    }

    // Get place - prefer 'place' field, fallback to 'birthCity'
    const place = input.place || input.birthCity || '';

    if (!place) {
        throw new Error('Birth place is required');
    }

    return {
        name: input.name,
        year,
        month,
        day,
        hour,
        minute,
        place,
        gender: input.gender
    };
}
