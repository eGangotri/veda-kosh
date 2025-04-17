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
        "mantra_ref_id" as keyof SamaVeda,
        queryObj
      )
    } else {
      // Numeric parameters
      const numericParams = [
        'archik_no',
        'prapathak',
        'ardh_prapathak',
        'dashti_no',
        'mantra_no',
        'adhyay_no',
        'khand_no',
        'mantra2_no',
        'mantra_sankhya',
        'sukta_no',
        'sukta2_no',
      ] as const
      
      numericParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          addNumberFilter<SamaVeda>(value, param as keyof SamaVeda, queryObj)
        }
      })

      // Text search parameters
      const textParams = [
        'archik_name',
        'kand_name',
        'gaan',
        'gaan_parva',
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
          addTextFilter<SamaVeda>(value, param as keyof SamaVeda, queryObj)
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
