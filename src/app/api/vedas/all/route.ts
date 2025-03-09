import { NextRequest, NextResponse } from "next/server"
import type { RigVeda, YajurVeda, SamaVeda, AtharvaVeda } from "@/types/vedas"
import type { Collection } from "mongodb"
import { addTextFilter, getVedaKoshaDB } from "../../lib/utils"
import { ITEM_LIMIT, RIG_VEDA, YAJUR_VEDA, SAMA_VEDA, ATHARVA_VEDA } from "../../lib/consts"
import { getVedaNameByVedaId } from "@/utils/Utils"
import { addNumericParams, addTextParams } from "../../Utils"

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
    const vedaType = searchParams.get('vedaType')

    if (!mantra) {
      return NextResponse.json(
        { message: "Mantra parameter is required" },
        { status: 400 }
      )
    }

    // Build query object for mantra search
    const queryObj: Record<string, any> = {}
    addTextFilter(mantra, "mantra", queryObj)
    addNumericParams(searchParams, queryObj)
    addTextParams(searchParams, queryObj)
    
    // Parse vedaType parameter to determine which collections to query
    const vedaTypes = vedaType ? vedaType.split(',').map(Number) : [1, 2, 3, 4]; // Default to all if not specified
    
    // Prepare results containers
    let rigVedaResults: RigVeda[] = [];
    let yajurVedaResults: YajurVeda[] = [];
    let samaVedaResults: SamaVeda[] = [];
    let atharvaVedaResults: AtharvaVeda[] = [];
    
    // Perform queries based on selected Veda types
    const queryPromises: Promise<any>[] = [];
    
    if (vedaTypes.includes(1)) {
      queryPromises.push(
        rigVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray()
          .then(results => { rigVedaResults = results; })
      );
    }
    
    if (vedaTypes.includes(2)) {
      queryPromises.push(
        yajurVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray()
          .then(results => { yajurVedaResults = results; })
      );
    }
    
    if (vedaTypes.includes(3)) {
      queryPromises.push(
        samaVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray()
          .then(results => { samaVedaResults = results; })
      );
    }
    
    if (vedaTypes.includes(4)) {
      queryPromises.push(
        atharvaVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray()
          .then(results => { atharvaVedaResults = results; })
      );
    }
    
    // Wait for all selected queries to complete
    await Promise.all(queryPromises);

    console.log(`Selected Veda types: ${vedaTypes.join(', ')}`);
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
