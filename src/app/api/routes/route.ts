import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET /api/routes - List all routes
export async function GET() {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching routes:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/routes - Create a new route
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const body = await request.json();

        const { name, origin, destination, batta_per_trip, salary_per_trip } = body;

        // Validation
        if (!name || !origin || !destination) {
            return NextResponse.json(
                { error: 'Name, origin, and destination are required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('routes')
            .insert({
                name,
                origin,
                destination,
                batta_per_trip: batta_per_trip || 0,
                salary_per_trip: salary_per_trip || 0,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error('Error creating route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
