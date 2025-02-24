import { NextApiRequest, NextApiResponse } from "next"
import type { YajurVeda } from "@/types/vedas" // Update the import to use YajurVeda
import type { Collection } from "mongodb"
import { addNumberFilter, addTextFilter, getVedaKoshaDB } from "../Utils"
import { ITEM_LIMIT, YAJUR_VEDA } from "../consts" // Update the constant to YAJUR_VEDA

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string; data?: YajurVeda[] }>
) {
    try {
        const vedaKoshaDB = await getVedaKoshaDB();
        const collection: Collection<YajurVeda> = vedaKoshaDB.collection(YAJUR_VEDA) // Update the collection to YAJUR_VEDA

        // Get query parameters
        const { query } = req
        const mantra_ref_id = query.mantra_ref_id as string
        const mantra = query.mantra as string
        const mantra_swara = query.mantra_swara as string
        const mantra_pad = query.mantra_pad as string
        const mantra_pad_swara = query.mantra_pad_swara as string
        const adhyay_no = query.adhyay_no as string
        const mantra_no = query.mantra_no as string
        const devata = query.devata as string
        const rishi = query.rishi as string
        const chhanda = query.chhanda as string
        const swara = query.swara as string

        // Build query object
        const queryObj: Record<string, any> = {}


        // Add numeric filters
        addNumberFilter(adhyay_no, "adhyay_no", queryObj)
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
        addTextFilter(swara, "swara", queryObj)

        // Perform the query
        const result: YajurVeda[] = await collection.find(queryObj).limit(ITEM_LIMIT).toArray()

        res.status(200).json({ message: "Data fetched successfully", data: result })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: "Error fetching data from the database" })
    }
}