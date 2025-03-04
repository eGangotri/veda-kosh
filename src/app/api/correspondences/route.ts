import { getRigVedaCorrespondencesStats } from '@/analytics/db/correspondencesStats';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = await getRigVedaCorrespondencesStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching RigVeda Ashtak stats:', error);
    return NextResponse.json(
      { message: 'Error fetching Ashtak statistics' },
      { status: 500 }
    );
  }
}