import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface RouteParams {
    params: { id: string };
}

// DELETE /api/trips/[id] - Delete trip
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const supabase = createServerClient();

        const { error } = await supabase
            .from('trips')
            .delete()
            .eq('id', params.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Error deleting trip:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
