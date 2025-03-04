import { NextRequest, NextResponse } from "next/server"
import type { RigVeda } from "@/types/vedas"
import type { Collection } from "mongodb"
import { addNumberFilter, addTextFilter, getVedaKoshaDB } from "../../Utils"
import { ITEM_LIMIT, RIG_VEDA } from "../../consts"

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
        "mantra_ref_id",
        queryObj
      )
    } else {
      // Numeric parameters
      const numericParams = [
        'mandal_no', 'sukta_no', 'mantra_no',
        'ashtak_no', 'adhyay_no', 'varga_no', 'mantra2_no'
      ]
      
      numericParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          addNumberFilter<RigVeda>(value, param, queryObj)
        }
      })

      // Text search parameters
      const textParams = [
        'devata', 'rishi', 'chhanda', 'swara',
        'mantra', 'mantra_swara', 'mantra_pad',
        'mantra_pad_swara', 'mantra_trans'
      ]

      textParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          addTextFilter<RigVeda>(value, param, queryObj)
        }
      })
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
