import { type NextRequest, NextResponse } from "next/server"
import type { RigVeda } from "@/types/vedas"
import type { Collection, } from "mongodb"
import { getVedaKoshaDB } from "../Utils"
import { ITEM_LIMIT, RIG_VEDA } from "../consts"

export default async function GET(request: NextRequest) {
    try {
        const vedaKoshaDB = await getVedaKoshaDB();
        const collection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA)

        // Get query parameters
        const searchParams = request.nextUrl.searchParams
        const mandal_no = searchParams.get("mandal_no")
        const sukta_no = searchParams.get("sukta_no")
        const mantra_no = searchParams.get("mantra_no")
        const ashtak_no = searchParams.get("ashtak_no")
        const adhyay_no = searchParams.get("adhyay_no")
        const varga_no = searchParams.get("varga_no")
        const mantra2_no = searchParams.get("mantra2_no")

        // New text search parameters
        const devata = searchParams.get("devata")
        const rishi = searchParams.get("rishi")
        const chhanda = searchParams.get("chhanda")
        const swara = searchParams.get("swara")
        const mantra = searchParams.get("mantra")
        const mantra_swara = searchParams.get("mantra_swara")
        const mantra_pad = searchParams.get("mantra_pad")
        const mantra_pad_swara = searchParams.get("mantra_pad_swara")
        const mantra_trans = searchParams.get("mantra_trans")

        // Build query object
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

        // Add numeric filters
        addNumberFilter(mandal_no, "mandal_no")
        addNumberFilter(sukta_no, "sukta_no")
        addNumberFilter(mantra_no, "mantra_no")
        addNumberFilter(ashtak_no, "ashtak_no")
        addNumberFilter(adhyay_no, "adhyay_no")
        addNumberFilter(varga_no, "varga_no")
        addNumberFilter(mantra2_no, "mantra2_no")

        // Add text search filters
        addTextFilter(devata, "devata")
        addTextFilter(rishi, "rishi")
        addTextFilter(chhanda, "chhanda")
        addTextFilter(swara, "swara")
        addTextFilter(mantra, "mantra")
        addTextFilter(mantra_swara, "mantra_swara")
        addTextFilter(mantra_pad, "mantra_pad")
        addTextFilter(mantra_pad_swara, "mantra_pad_swara")
        addTextFilter(mantra_trans, "mantra_trans")

        // Perform the query
        const result: RigVeda[] = await collection.find(query).limit(ITEM_LIMIT).toArray()

        return NextResponse.json({ message: "Data fetched successfully", data: result })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: "Error fetching data from the database" }, { status: 500 })
    }
}

