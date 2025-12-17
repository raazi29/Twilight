import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function PATCH(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const supabase = createServerClient();
        // Await context.params before accessing properties
        const { id } = await Promise.resolve(context.params);

        const { error } = await supabase
            .from('settlements')
            .update({
                status: 'paid',
                settled_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating settlement:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
