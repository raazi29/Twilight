import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET /api/drivers - List all drivers
export async function GET() {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('drivers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/drivers - Create a new driver
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const body = await request.json();

        const { name, phone, vehicle_number, payment_preference } = body;

        // Validation
        if (!name) {
            return NextResponse.json(
                { error: 'Driver name is required' },
                { status: 400 }
            );
        }

        if (payment_preference && !['batta_only', 'salary_only', 'split'].includes(payment_preference)) {
            return NextResponse.json(
                { error: 'Invalid payment preference' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('drivers')
            .insert({
                name,
                phone: phone || null,
                vehicle_number: vehicle_number || null,
                payment_preference: payment_preference || 'split',
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error('Error creating driver:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
