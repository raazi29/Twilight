import { Trip, Route, PaymentPreference } from './supabase/types';

export interface EarningsResult {
    batta: number;
    salary: number;
}

// Accept driver with a flexible payment_preference type
interface DriverInput {
    payment_preference: string;
}

interface RouteInput {
    batta_per_trip: number;
    salary_per_trip: number;
}

/**
 * Calculate trip earnings based on driver preference and route configuration
 */
export function calculateTripEarnings(
    route: RouteInput,
    driver: DriverInput,
    tripCount: number = 1
): EarningsResult {

    const totalPerTrip = route.batta_per_trip + route.salary_per_trip;

    switch (driver.payment_preference) {
        case 'batta_only':
            // All earnings go to Batta bucket
            return {
                batta: totalPerTrip * tripCount,
                salary: 0,
            };

        case 'salary_only':
            // All earnings go to Salary bucket
            return {
                batta: 0,
                salary: totalPerTrip * tripCount,
            };

        case 'split':
            // Split as per route configuration
            return {
                batta: route.batta_per_trip * tripCount,
                salary: route.salary_per_trip * tripCount,
            };

        default:
            throw new Error(`Unknown payment preference: ${driver.payment_preference}`);
    }
}

/**
 * Calculate total earnings from multiple trips
 */
export function calculateTotalEarnings(trips: Trip[]): EarningsResult {
    return trips.reduce(
        (total, trip) => ({
            batta: total.batta + trip.batta_earned,
            salary: total.salary + trip.salary_earned,
        }),
        { batta: 0, salary: 0 }
    );
}

/**
 * Get payment preference display text
 */
export function getPaymentPreferenceLabel(preference: PaymentPreference): string {
    switch (preference) {
        case 'batta_only':
            return 'Batta Only';
        case 'salary_only':
            return 'Salary Only';
        case 'split':
            return 'Split (Batta + Salary)';
        default:
            return 'Unknown';
    }
}

/**
 * Payment preference options for forms
 */
export const PAYMENT_PREFERENCES: { value: PaymentPreference; label: string; description: string }[] = [
    {
        value: 'batta_only',
        label: 'Batta Only',
        description: 'All earnings classified as Batta (settled weekly)',
    },
    {
        value: 'salary_only',
        label: 'Salary Only',
        description: 'All earnings classified as Salary (settled monthly)',
    },
    {
        value: 'split',
        label: 'Batta + Salary',
        description: 'Split as per route configuration',
    },
];
