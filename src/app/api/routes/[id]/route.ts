import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface RouteParams {
    params: { id: string };
}

// GET /api/routes/[id] - Get single route
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Route not found' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/routes/[id] - Update route
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServerClient();
        const body = await request.json();

        const { name, origin, destination, batta_per_trip, salary_per_trip } = body;

        const { data, error } = await supabase
            .from('routes')
            .update({
                name,
                origin,
                destination,
                batta_per_trip,
                salary_per_trip,
            })
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error updating route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/routes/[id] - Delete route
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServerClient();

        const { error } = await supabase
            .from('routes')
            .delete()
            .eq('id', params.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Route deleted successfully' });
    } catch (error) {
        console.error('Error deleting route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
