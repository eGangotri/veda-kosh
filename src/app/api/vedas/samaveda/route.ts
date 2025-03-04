import { NextRequest, NextResponse } from "next/server"
import type { SamaVeda } from "@/types/vedas"
import type { Collection } from "mongodb"
import { addNumberFilter, addTextFilter, getVedaKoshaDB } from "../../lib/utils"
import { ITEM_LIMIT, SAMA_VEDA } from "../../lib/consts"

export async function GET(request: NextRequest) {
  try {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<SamaVeda> = vedaKoshaDB.collection(SAMA_VEDA)
    
    // Build query object
    const queryObj: Record<string, any> = {}
    const { searchParams } = new URL(request.url)

    // Get query parameters and add filters
    if (searchParams.has('mantra_ref_id')) {
      addTextFilter<SamaVeda>(
        searchParams.get('mantra_ref_id') as string,
        "mantra_ref_id",
        queryObj
      )
    } else {
      // Numeric parameters
      const numericParams = [
        'kand_no', 'adhyay_no', 'mantra_no'
      ]
      
      numericParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          addNumberFilter<SamaVeda>(value, param, queryObj)
        }
      })

      // Text search parameters
      const textParams = [
        'mantra', 'mantra_trans', 'rishi', 'devata'
      ]

      textParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          addTextFilter<SamaVeda>(value, param, queryObj)
        }
      })
    }

    // Perform the query
    const result: SamaVeda[] = await collection
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
