import { NextRequest, NextResponse } from "next/server"
import type { RigVeda } from "@/types/vedas"
import type { Collection } from "mongodb"
import { addNumberFilter, addTextFilter, getVedaKoshaDB } from "../../lib/utils"
import { ITEM_LIMIT, RIG_VEDA } from "../../lib/consts"
import { addNumericParams, addTextParams } from "../../Utils"

export async function GET(request: NextRequest) {
  try {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA)
    
    // Build query object
    const queryObj: Record<string, any> = {}
    const { searchParams } = new URL(request.url)

    // Get query parameters and add filters
    if (searchParams.has('mantra_ref_id')) {
      addTextFilter<RigVeda>(
        searchParams.get('mantra_ref_id') as string,
        "mantra_ref_id" as keyof RigVeda,
        queryObj
      )
    } else {
      addNumericParams(searchParams, queryObj)
      addTextParams(searchParams, queryObj)
    }

    // Perform the query
    const result: RigVeda[] = await collection
      .find(queryObj)
      .limit(ITEM_LIMIT)
      .toArray()

    return NextResponse.json({
      message: "Data fetched successfully",
      data: result
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Error fetching data from the database" },
      { status: 500 }
    )
  }
}
