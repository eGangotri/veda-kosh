import { NextRequest, NextResponse } from "next/server"
import type { AtharvaVeda } from "@/types/vedas"
import type { Collection } from "mongodb"
import { addNumberFilter, addTextFilter, getVedaKoshaDB } from "../../lib/utils"
import { ITEM_LIMIT, ATHARVA_VEDA } from "../../lib/consts"

export async function GET(request: NextRequest) {
  try {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<AtharvaVeda> = vedaKoshaDB.collection(ATHARVA_VEDA)
    
    // Build query object
    const queryObj: Record<string, any> = {}
    const { searchParams } = new URL(request.url)

    // Get query parameters and add filters
    if (searchParams.has('mantra_ref_id')) {
      addTextFilter<AtharvaVeda>(
        searchParams.get('mantra_ref_id') as string,
        "mantra_ref_id" as keyof AtharvaVeda,
        queryObj
      )
    } else {
      // Numeric parameters
      const numericParams = [
        'kand_no',
        'sukta_no',
        'mantra_no'
      ] as const
      
      numericParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          addNumberFilter<AtharvaVeda>(value, param as keyof AtharvaVeda, queryObj)
        }
      })

      // Text search parameters
      const textParams = [
        'mantra',
        'mantra_trans',
        'mantra_swara',
        'mantra_pad',
        'mantra_pad_swara',
        'devata',
        'rishi',
        'chhanda',
        'suktam',
      ] as const
      
      textParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          addTextFilter<AtharvaVeda>(value, param as keyof AtharvaVeda, queryObj)
        }
      })
    }

    // Perform the query
    const result: AtharvaVeda[] = await collection
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
