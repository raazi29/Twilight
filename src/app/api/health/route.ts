import { NextRequest, NextResponse } from 'next/server';

// Health check endpoint for monitoring
export async function GET(request: NextRequest) {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '0.1.0',
        environment: process.env.NODE_ENV,
        checks: {
            clerk: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
            supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        },
    };

    const allHealthy = Object.values(health.checks).every(Boolean);

    return NextResponse.json(health, {
        status: allHealthy ? 200 : 503,
    });
}
