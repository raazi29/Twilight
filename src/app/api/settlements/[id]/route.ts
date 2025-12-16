import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface RouteParams {
    params: { id: string };
}

// GET /api/settlements/[id] - Get single settlement with trip breakdown
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServerClient();

        const { data: settlement, error } = await supabase
            .from('settlements')
            .select(`
        *,
        driver:drivers(*)
      `)
            .eq('id', params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Settlement not found' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get trips for this settlement period
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

        return NextResponse.json({
            data: {
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
            },
        });
    } catch (error) {
        console.error('Error fetching settlement:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/settlements/[id] - Update settlement status
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServerClient();
        const body = await request.json();

        const { status, notes } = body;

        if (status && !['pending', 'paid'].includes(status)) {
            return NextResponse.json(
                { error: 'Status must be "pending" or "paid"' },
                { status: 400 }
            );
        }

        const updateData: Record<string, any> = {};
        if (status) {
            updateData.status = status;
            if (status === 'paid') {
                updateData.settled_at = new Date().toISOString();
            }
        }
        if (notes !== undefined) {
            updateData.notes = notes;
        }

        const { data, error } = await supabase
            .from('settlements')
            .update(updateData)
            .eq('id', params.id)
            .select(`
        *,
        driver:drivers(*)
      `)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error updating settlement:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/settlements/[id] - Delete settlement (only if pending)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServerClient();

        // First check if it's pending
        const { data: settlement } = await supabase
            .from('settlements')
            .select('status')
            .eq('id', params.id)
            .single();

        if (settlement?.status === 'paid') {
            return NextResponse.json(
                { error: 'Cannot delete a paid settlement' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('settlements')
            .delete()
            .eq('id', params.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Settlement deleted successfully' });
    } catch (error) {
        console.error('Error deleting settlement:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
