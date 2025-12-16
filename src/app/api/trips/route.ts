import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { calculateTripEarnings } from '@/lib/earnings-calculator';

// GET /api/trips - List all trips with optional filters
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const { searchParams } = new URL(request.url);

        const driverId = searchParams.get('driver_id');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');

        let query = supabase
            .from('trips')
            .select(`
        *,
        driver:drivers(*),
        route:routes(*)
      `)
            .order('trip_date', { ascending: false });

        if (driverId) {
            query = query.eq('driver_id', driverId);
        }

        if (startDate) {
            query = query.gte('trip_date', startDate);
        }

        if (endDate) {
            query = query.lte('trip_date', endDate);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching trips:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/trips - Create a new trip with automatic earnings calculation
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const body = await request.json();

        const { driver_id, route_id, vehicle_number, trip_date, trip_count } = body;

        // Validation
        if (!driver_id || !route_id || !vehicle_number || !trip_date) {
            return NextResponse.json(
                { error: 'Driver, route, vehicle number, and trip date are required' },
                { status: 400 }
            );
        }

        // Fetch driver and route for earnings calculation
        const [driverResult, routeResult] = await Promise.all([
            supabase.from('drivers').select('*').eq('id', driver_id).single(),
            supabase.from('routes').select('*').eq('id', route_id).single(),
        ]);

        if (driverResult.error || !driverResult.data) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        if (routeResult.error || !routeResult.data) {
            return NextResponse.json({ error: 'Route not found' }, { status: 404 });
        }

        // Calculate earnings based on driver preference
        const earnings = calculateTripEarnings(
            routeResult.data,
            driverResult.data,
            trip_count || 1
        );

        const { data, error } = await supabase
            .from('trips')
            .insert({
                driver_id,
                route_id,
                vehicle_number,
                trip_date,
                trip_count: trip_count || 1,
                batta_earned: earnings.batta,
                salary_earned: earnings.salary,
            })
            .select(`
        *,
        driver:drivers(*),
        route:routes(*)
      `)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error('Error creating trip:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
