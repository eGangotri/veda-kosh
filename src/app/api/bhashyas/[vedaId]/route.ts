import { NextResponse } from 'next/server';
import { getVedaBhashyas } from '@/analytics/db/bhashyaStats';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ vedaId: string }> }

) {
  // Convert the vedaId from string to number
  const vedaIdParam = await params
  const vedaId = parseInt(vedaIdParam.vedaId, 10);
  console.log(`Veda ID: ${vedaId}`);
  console.log(`vedaIdParam : ${JSON.stringify(vedaIdParam)}`);
  try {

    // Validate vedaId
    if (isNaN(vedaId) || vedaId < 0 || vedaId >= 4) {
      return NextResponse.json(
        { error: 'Invalid Veda ID. Must be between 0 and 3.' },
        { status: 400 }
      );
    }

    const bhashyaMaps = await getVedaBhashyas(vedaId);
    console.log(`bhashyaMaps: ${JSON.stringify(bhashyaMaps.uniqueBhashyaNames)}`);
    // Return the array of bhashya maps directly
    return NextResponse.json(bhashyaMaps);
  } catch (error) {
    console.error(`Error fetching bhashyas for Veda ID ${vedaId}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch bhashyas for Veda ID ${vedaId}` },
      { status: 500 }
    );
  }
}
