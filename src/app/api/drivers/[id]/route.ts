import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface RouteParams {
    params: { id: string };
}

// GET /api/drivers/[id] - Get single driver
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('drivers')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching driver:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/drivers/[id] - Update driver
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServerClient();
        const body = await request.json();

        const { name, phone, vehicle_number, payment_preference } = body;

        if (payment_preference && !['batta_only', 'salary_only', 'split'].includes(payment_preference)) {
            return NextResponse.json(
                { error: 'Invalid payment preference' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('drivers')
            .update({
                name,
                phone,
                vehicle_number,
                payment_preference,
            })
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error updating driver:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/drivers/[id] - Delete driver
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServerClient();

        const { error } = await supabase
            .from('drivers')
            .delete()
            .eq('id', params.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Driver deleted successfully' });
    } catch (error) {
        console.error('Error deleting driver:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
