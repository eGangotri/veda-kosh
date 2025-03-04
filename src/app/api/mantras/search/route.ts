import { NextRequest, NextResponse } from "next/server"
import type { RigVeda } from "@/types/vedas"
import { ITEM_LIMIT, RIG_VEDA } from "../../lib/consts"
import type { Collection } from "mongodb"
import { getVedaKoshaDB } from "../../lib/utils"

export async function GET(request: NextRequest) {
    try {
        const vedaKoshaDB = await getVedaKoshaDB();
        const collection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA)

        const { searchParams } = new URL(request.url)
        const query: Record<string, any> = {}

        // Helper function to safely parse and add number filters
        const addNumberFilter = (param: string | null, field: keyof RigVeda) => {
            if (param) {
                const value = Number.parseInt(param, 10)
                if (!isNaN(value)) {
                    query[field] = value as any
                }
            }
        }

        // Helper function to add text search filters
        const addTextFilter = (param: string | null, field: keyof RigVeda) => {
            if (param && param.trim()) {
                query[field] = { $regex: param.trim(), $options: "i" }
            }
        }

        // Numeric parameters
        const numericParams: Array<[string, keyof RigVeda]> = [
            ['mandal_no', 'mandal_no'],
            ['sukta_no', 'sukta_no'],
            ['mantra_no', 'mantra_no'],
            ['ashtak_no', 'ashtak_no'],
            ['adhyay_no', 'adhyay_no'],
            ['varga_no', 'varga_no'],
            ['mantra2_no', 'mantra2_no']
        ]

        // Text parameters
        const textParams: Array<[string, keyof RigVeda]> = [
            ['devata', 'devata'],
            ['rishi', 'rishi'],
            ['chhanda', 'chhanda'],
            ['swara', 'swara'],
            ['mantra', 'mantra'],
            ['mantra_swara', 'mantra_swara'],
            ['mantra_pad', 'mantra_pad'],
            ['mantra_pad_swara', 'mantra_pad_swara'],
            ['mantra_trans', 'mantra_trans']
        ]

        // Add filters
        numericParams.forEach(([param, field]) => {
            addNumberFilter(searchParams.get(param), field)
        })

        textParams.forEach(([param, field]) => {
            addTextFilter(searchParams.get(param), field)
        })

        // Perform the query
        const result: RigVeda[] = await collection
            .find(query)
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
