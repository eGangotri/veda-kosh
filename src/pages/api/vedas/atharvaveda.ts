import { NextApiRequest, NextApiResponse } from "next"
import type { AtharvaVeda } from "@/types/vedas" // Update the import to use AtharvaVeda
import type { Collection } from "mongodb"
import { addNumberFilter, addTextFilter, getVedaKoshaDB } from "../Utils"
import { ITEM_LIMIT, ATHARVA_VEDA } from "../consts" // Update the constant to ATHARVA_VEDA

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string; data?: AtharvaVeda[] }>
) {
    try {
        const vedaKoshaDB = await getVedaKoshaDB();
        const collection: Collection<AtharvaVeda> = vedaKoshaDB.collection(ATHARVA_VEDA) // Update the collection to ATHARVA_VEDA

        // Get query parameters
        const { query } = req
        const mantra_ref_id = query.mantra_ref_id as string
        const mantra = query.mantra as string
        const mantra_swara = query.mantra_swara as string
        const mantra_pad = query.mantra_pad as string
        const mantra_pad_swara = query.mantra_pad_swara as string
        const kand_no = query.kand_no as string
        const sukta_no = query.sukta_no as string
        const mantra_no = query.mantra_no as string
        const devata = query.devata as string
        const rishi = query.rishi as string
        const chhanda = query.chhanda as string
        const suktam = query.suktam as string

        // Build query object
        const queryObj: Record<string, any> = {}

        // Add numeric filters
        addNumberFilter(kand_no, "kand_no", queryObj)
        addNumberFilter(sukta_no, "sukta_no", queryObj)
        addNumberFilter(mantra_no, "mantra_no", queryObj)

        // Add text search filters
        addTextFilter(mantra_ref_id, "mantra_ref_id", queryObj)
        addTextFilter(mantra, "mantra", queryObj)
        addTextFilter(mantra_swara, "mantra_swara", queryObj)
        addTextFilter(mantra_pad, "mantra_pad", queryObj)
        addTextFilter(mantra_pad_swara, "mantra_pad_swara", queryObj)
        addTextFilter(devata, "devata", queryObj)
        addTextFilter(rishi, "rishi", queryObj)
        addTextFilter(chhanda, "chhanda", queryObj)
        addTextFilter(suktam, "suktam", queryObj)

        // Perform the query
        const result: AtharvaVeda[] = await collection.find(queryObj).limit(ITEM_LIMIT).toArray()

        res.status(200).json({ message: "Data fetched successfully", data: result })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: "Error fetching data from the database" })
    }
}