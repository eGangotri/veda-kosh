import { NextRequest, NextResponse } from "next/server"
import type { YajurVeda } from "@/types/vedas"
import type { Collection } from "mongodb"
import { addNumberFilter, addTextFilter, getVedaKoshaDB } from "../../lib/utils"
import { ITEM_LIMIT, YAJUR_VEDA } from "../../lib/consts"

export async function GET(request: NextRequest) {
  try {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<YajurVeda> = vedaKoshaDB.collection(YAJUR_VEDA)
    
    // Build query object
    const queryObj: Record<string, any> = {}
    const { searchParams } = new URL(request.url)

    // Get query parameters and add filters
    if (searchParams.has('mantra_ref_id')) {
      addTextFilter<YajurVeda>(
        searchParams.get('mantra_ref_id') as string,
        "mantra_ref_id" as keyof YajurVeda,
        queryObj
      )
    } else {
      // Numeric parameters
      const numericParams = [
        'adhyay_no',
        'mantra_no'
      ] as const
      
      numericParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          addNumberFilter<YajurVeda>(value, param as keyof YajurVeda, queryObj)
        }
      })

      // Text search parameters
      const textParams = [
        'devata',
        'rishi',
        'chhanda',
        'swara',
        'mantra',
        'mantra_swara',
        'mantra_pad',
        'mantra_pad_swara'
      ] as const

      textParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          addTextFilter<YajurVeda>(value, param as keyof YajurVeda, queryObj)
        }
      })
    }

    // Perform the query
    const result: YajurVeda[] = await collection
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
