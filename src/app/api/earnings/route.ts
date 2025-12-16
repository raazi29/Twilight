import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET /api/earnings - Get earnings summary
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const { searchParams } = new URL(request.url);

        const driverId = searchParams.get('driver_id');
        const period = searchParams.get('period') || 'weekly'; // 'weekly' or 'monthly'

        // Calculate date range
        const today = new Date();
        let startDate: Date;
        let endDate: Date = today;

        if (period === 'weekly') {
            // Start of current week (Monday)
            startDate = new Date(today);
            const day = startDate.getDay();
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
            startDate.setDate(diff);
            startDate.setHours(0, 0, 0, 0);
        } else {
            // Start of current month
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        }

        // Build query
        let query = supabase
            .from('trips')
            .select('batta_earned, salary_earned, trip_count')
            .gte('trip_date', startDate.toISOString().split('T')[0])
            .lte('trip_date', endDate.toISOString().split('T')[0]);

        if (driverId) {
            query = query.eq('driver_id', driverId);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Aggregate earnings
        const summary = (data || []).reduce(
            (acc, trip) => ({
                total_batta: acc.total_batta + Number(trip.batta_earned),
                total_salary: acc.total_salary + Number(trip.salary_earned),
                trip_count: acc.trip_count + trip.trip_count,
            }),
            { total_batta: 0, total_salary: 0, trip_count: 0 }
        );

        // Check for unsettled amounts (settlements that overlap with current period)
        let settlementsQuery = supabase
            .from('settlements')
            .select('amount, settlement_type')
            .lte('period_start', endDate.toISOString().split('T')[0])
            .gte('period_end', startDate.toISOString().split('T')[0])
            .eq('status', 'paid');

        if (driverId) {
            settlementsQuery = settlementsQuery.eq('driver_id', driverId);
        }

        const { data: settlements } = await settlementsQuery;

        const settled = (settlements || []).reduce(
            (acc, s) => ({
                batta: acc.batta + (s.settlement_type === 'batta' ? Number(s.amount) : 0),
                salary: acc.salary + (s.settlement_type === 'salary' ? Number(s.amount) : 0),
            }),
            { batta: 0, salary: 0 }
        );

        return NextResponse.json({
            data: {
                ...summary,
                unsettled_batta: Math.max(0, summary.total_batta - settled.batta),
                unsettled_salary: Math.max(0, summary.total_salary - settled.salary),
                period_start: startDate.toISOString().split('T')[0],
                period_end: endDate.toISOString().split('T')[0],
                period,
            },
        });
    } catch (error) {
        console.error('Error fetching earnings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
