import { NextRequest, NextResponse } from 'next/server';
import type { RigVeda, YajurVeda, SamaVeda, AtharvaVeda } from "@/types/vedas"
import type { Collection } from "mongodb"
import { RIG_VEDA, YAJUR_VEDA, SAMA_VEDA, ATHARVA_VEDA } from "@/app/api/lib/consts";
import { getVedaKoshaDB } from '@/app/api/lib/utils';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startingChar = searchParams.get('startingChar');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  if (!startingChar) {
    return NextResponse.json(
      { message: 'Starting character is required' },
      { status: 400 }
    );
  }

  try {
    const vedaKoshaDB = await getVedaKoshaDB();
    
    const rigVedaCollection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA);
    const yajurVedaCollection: Collection<YajurVeda> = vedaKoshaDB.collection(YAJUR_VEDA);
    const samaVedaCollection: Collection<SamaVeda> = vedaKoshaDB.collection(SAMA_VEDA);
    const atharvaVedaCollection: Collection<AtharvaVeda> = vedaKoshaDB.collection(ATHARVA_VEDA);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const queryObj = {
      mantra: {
        $regex: `^${startingChar}`,
        $options: 'i'
      }
    };

    console.log(`queryObj: ${JSON.stringify(queryObj)}`);
    
    const [rigVedaResults, yajurVedaResults, samaVedaResults, atharvaVedaResults] = await Promise.all([
      rigVedaCollection.find(queryObj).skip(skip).limit(parseInt(limit)).toArray(),
      yajurVedaCollection.find(queryObj).skip(skip).limit(parseInt(limit)).toArray(),
      samaVedaCollection.find(queryObj).skip(skip).limit(parseInt(limit)).toArray(),
      atharvaVedaCollection.find(queryObj).skip(skip).limit(parseInt(limit)).toArray()
    ]);

    return NextResponse.json({
      message: "Data fetched successfully",
      data: { rigVedaResults, yajurVedaResults, samaVedaResults, atharvaVedaResults }
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { message: 'Error connecting to database' },
      { status: 500 }
    );
  }
}
