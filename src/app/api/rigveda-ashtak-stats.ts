import { NextResponse } from 'next/server';
import { getRigVedaAshtakStats } from '../../analytics/ashtakStats';

export async function GET() {
    try {
        const stats = await getRigVedaAshtakStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching RigVeda Ashtak stats:', error);
        return NextResponse.json(
            { message: 'Error fetching Ashtak statistics' },
            { status: 500 }
        );
    }
}
