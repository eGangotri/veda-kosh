import { NextRequest, NextResponse } from 'next/server';
import { 
    getAtharvaVedaKandStats, 
    getRigVedaMandalaStats,
    getYajurVedaMandalaStats 
} from '../../analytics/stats';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const typeNum = type ? parseInt(type) : 0;

        switch (typeNum) {
            case 1: {
                const stats = await getRigVedaMandalaStats();
                return NextResponse.json(stats);
            }
            case 2: {
                const stats = await getYajurVedaMandalaStats();
                return NextResponse.json(stats);
            }
            case 3: {
                return NextResponse.json({
                    msg: "No Stats needed for Samaveda"
                });
            }
            case 4: {
                const stats = await getAtharvaVedaKandStats();
                return NextResponse.json(stats);
            }
            default: {
                return NextResponse.json(
                    { message: "Provide a valid Veda type" },
                    { status: 400 }
                );
            }
        }
    } catch (error) {
        console.error('Error fetching Veda stats:', error);
        return NextResponse.json(
            { message: 'Error fetching statistics' },
            { status: 500 }
        );
    }
}
