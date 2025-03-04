import { NextRequest, NextResponse } from "next/server"
import type { RigVeda, YajurVeda, SamaVeda, AtharvaVeda, VedaResultType } from "@/types/vedas"
import type { Collection } from "mongodb"
import { addTextFilter, getVedaKoshaDB } from "../../Utils"
import { ITEM_LIMIT, RIG_VEDA, YAJUR_VEDA, SAMA_VEDA, ATHARVA_VEDA } from "../../consts"

export async function GET(request: NextRequest) {
  try {
    const vedaKoshaDB = await getVedaKoshaDB();

    const rigVedaCollection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA)
    const yajurVedaCollection: Collection<YajurVeda> = vedaKoshaDB.collection(YAJUR_VEDA)
    const samaVedaCollection: Collection<SamaVeda> = vedaKoshaDB.collection(SAMA_VEDA)
    const atharvaVedaCollection: Collection<AtharvaVeda> = vedaKoshaDB.collection(ATHARVA_VEDA)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const mantra = searchParams.get('mantra')

    if (!mantra) {
      return NextResponse.json(
        { message: "Mantra parameter is required" },
        { status: 400 }
      )
    }

    // Build query object for mantra search
    const queryObj: Record<string, any> = {}
    addTextFilter(mantra, "mantra", queryObj)

    console.log(`queryObj: ${JSON.stringify(queryObj)}`)
    
    // Perform the queries
    const [rigVedaResults, yajurVedaResults, samaVedaResults, atharvaVedaResults] = await Promise.all([
      rigVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray(),
      yajurVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray(),
      samaVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray(),
      atharvaVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray()
    ])

    console.log(`lengths: ${rigVedaResults.length} ${yajurVedaResults.length} ${samaVedaResults.length} ${atharvaVedaResults.length}`)
    
    return NextResponse.json({
      message: "Data fetched successfully",
      data: { rigVedaResults, yajurVedaResults, samaVedaResults, atharvaVedaResults }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Error fetching data from the database" },
      { status: 500 }
    )
  }
}
