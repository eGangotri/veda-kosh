import { NextResponse } from 'next/server';
import { getVedaBhashyas } from '@/analytics/db/bhashyaStats';

export async function GET(
  request: Request,
  { params }: { params: { vedaId: string } }
) {
  try {
    // Convert the vedaId from string to number
    const vedaId = parseInt(params.vedaId, 10);
    
    // Validate vedaId
    if (isNaN(vedaId) || vedaId < 0 || vedaId >= 4) {
      return NextResponse.json(
        { error: 'Invalid Veda ID. Must be between 0 and 3.' },
        { status: 400 }
      );
    }

    const bhashyaMaps = await getVedaBhashyas(vedaId);
    
    // Return the array of bhashya maps directly
    return NextResponse.json(bhashyaMaps);
  } catch (error) {
    console.error(`Error fetching bhashyas for Veda ID ${params.vedaId}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch bhashyas for Veda ID ${params.vedaId}` },
      { status: 500 }
    );
  }
}
