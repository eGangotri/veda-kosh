import { NextApiRequest, NextApiResponse } from 'next';
import type { RigVeda, YajurVeda, SamaVeda, 
  AtharvaVeda } from "@/types/vedas"
import type { Collection } from "mongodb"
import {  RIG_VEDA, YAJUR_VEDA, SAMA_VEDA, ATHARVA_VEDA } from "@/app/api/lib/consts";
import { getVedaKoshaDB } from '@/app/api/lib/utils';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { startingChar, page = '1', limit = '10' } = req.query;

  if (!startingChar) {
    return res.status(400).json({ message: 'Starting character is required' });
  }

  try {
    const vedaKoshaDB = await getVedaKoshaDB();

    
    const rigVedaCollection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA)
    const yajurVedaCollection: Collection<YajurVeda> = vedaKoshaDB.collection(YAJUR_VEDA)
    const samaVedaCollection: Collection<SamaVeda> = vedaKoshaDB.collection(SAMA_VEDA)
    const atharvaVedaCollection: Collection<AtharvaVeda> = vedaKoshaDB.collection(ATHARVA_VEDA)

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    // Create query for Devanagari text search
    const queryObj = {
      mantra: {
        $regex: `^${startingChar}`,
        $options: 'i'  // case-insensitive search
      }
    };

    console.log(`queryObj: ${JSON.stringify(queryObj)}`)
    // Perform the queries
    const [rigVedaResults, yajurVedaResults, samaVedaResults, atharvaVedaResults] = await Promise.all([
      rigVedaCollection.find(queryObj).skip(skip).limit(parseInt(limit as string)).toArray(),
      yajurVedaCollection.find(queryObj).skip(skip).limit(parseInt(limit as string)).toArray(),
      samaVedaCollection.find(queryObj).skip(skip).limit(parseInt(limit as string)).toArray(),
      atharvaVedaCollection.find(queryObj).skip(skip).limit(parseInt(limit as string)).toArray()
    ])

    res.status(200).json({ message: "Data fetched successfully", data: { rigVedaResults, yajurVedaResults, samaVedaResults, atharvaVedaResults } })

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Error connecting to database' });
  }
}
