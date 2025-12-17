import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET /api/settlements - List all settlements with optional filters
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const { searchParams } = new URL(request.url);

        const driverId = searchParams.get('driver_id');
        const settlementType = searchParams.get('type'); // 'batta' or 'salary'
        const status = searchParams.get('status'); // 'pending' or 'paid'

        let query = supabase
            .from('settlements')
            .select(`
        *,
        driver:drivers(*)
      `)
            .order('created_at', { ascending: false });

        if (driverId) {
            query = query.eq('driver_id', driverId);
        }

        if (settlementType) {
            query = query.eq('settlement_type', settlementType);
        }

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // For each settlement, get the trips in that period
        const settlementsWithTrips = await Promise.all(
            (data || []).map(async (settlement) => {
                const { data: trips } = await supabase
                    .from('trips')
                    .select(`
            trip_date,
            trip_count,
            batta_earned,
            salary_earned,
            route:routes(name)
          `)
                    .eq('driver_id', settlement.driver_id)
                    .gte('trip_date', settlement.period_start)
                    .lte('trip_date', settlement.period_end);

                return {
                    ...settlement,
                    trips: (trips || []).map((t) => ({
                        date: t.trip_date,
                        route: (t.route as any)?.name || 'Unknown Route',
                        count: t.trip_count,
                        amount:
                            settlement.settlement_type === 'batta'
                                ? t.batta_earned
                                : t.salary_earned,
                    })),
                };
            })
        );

        return NextResponse.json({ data: settlementsWithTrips });
    } catch (error) {
        console.error('Error fetching settlements:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/settlements - Create a new settlement
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const body = await request.json();

        const { driver_id, settlement_type, period_start, period_end, notes } = body;

        // Validation
        if (!driver_id || !settlement_type || !period_start || !period_end) {
            return NextResponse.json(
                { error: 'Driver, settlement type, and period dates are required' },
                { status: 400 }
            );
        }

        if (!['batta', 'salary'].includes(settlement_type)) {
            return NextResponse.json(
                { error: 'Settlement type must be "batta" or "salary"' },
                { status: 400 }
            );
        }

        // Calculate settlement amount from unsettled trips
        console.log(`Fetching trips for Driver: ${driver_id}, Range: ${period_start} to ${period_end}`);

        const { data: trips, error: tripsError } = await supabase
            .from('trips')
            .select('batta_earned, salary_earned, trip_date, route_id')
            .eq('driver_id', driver_id)
            .gte('trip_date', period_start)
            .lte('trip_date', period_end);

        if (tripsError) {
            console.error("Error fetching trips for settlement:", tripsError);
            return NextResponse.json({ error: tripsError.message }, { status: 500 });
        }

        console.log("Found trips:", trips);

        const amount = (trips || []).reduce((sum, trip) => {
            const val = Number(settlement_type === 'batta' ? trip.batta_earned : trip.salary_earned);
            console.log(`Trip Date: ${trip.trip_date}, Type: ${settlement_type}, Value: ${val}`);
            return sum + val;
        }, 0);

        console.log("Total calculated amount:", amount);

        if (amount === 0) {
            const tripCount = (trips || []).length;
            let detail = "";

            if (tripCount === 0) {
                detail = "No trips found in this date range.";
            } else {
                detail = `Found ${tripCount} trips, but their calculated ${settlement_type} value is 0. Check if the driver's payment preference supports ${settlement_type}.`;
            }

            return NextResponse.json(
                { error: `Cannot create settlement: ${detail}` },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('settlements')
            .insert({
                driver_id,
                settlement_type,
                period_start,
                period_end,
                amount,
                status: 'pending',
                notes: notes || null,
            })
            .select(`
        *,
        driver:drivers(*)
      `)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error('Error creating settlement:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
