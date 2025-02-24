import { NextApiRequest, NextApiResponse } from "next"
import type { RigVeda } from "@/types/vedas"
import type { Collection } from "mongodb"
import { addNumberFilter, addTextFilter, getVedaKoshaDB } from "../Utils"
import { ITEM_LIMIT, RIG_VEDA } from "../consts"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string; data?: RigVeda[] }>
) {
    try {
        const vedaKoshaDB = await getVedaKoshaDB();
        const collection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA)

        // Get query parameters
        const { query } = req
        const mandal_no = query.mandal_no as string
        const sukta_no = query.sukta_no as string
        const mantra_no = query.mantra_no as string
        const ashtak_no = query.ashtak_no as string
        const adhyay_no = query.adhyay_no as string
        const varga_no = query.varga_no as string
        const mantra2_no = query.mantra2_no as string

        // New text search parameters
        const devata = query.devata as string
        const rishi = query.rishi as string
        const chhanda = query.chhanda as string
        const swara = query.swara as string
        const mantra = query.mantra as string
        const mantra_swara = query.mantra_swara as string
        const mantra_pad = query.mantra_pad as string
        const mantra_pad_swara = query.mantra_pad_swara as string
        const mantra_trans = query.mantra_trans as string

        // Build query object
        const queryObj: Record<string, any> = {}

        // Add numeric filters
        addNumberFilter(mandal_no, "mandal_no", queryObj)
        addNumberFilter(sukta_no, "sukta_no", queryObj)
        addNumberFilter(mantra_no, "mantra_no", queryObj)
        addNumberFilter(ashtak_no, "ashtak_no", queryObj)
        addNumberFilter(adhyay_no, "adhyay_no", queryObj)
        addNumberFilter(varga_no, "varga_no", queryObj)
        addNumberFilter(mantra2_no, "mantra2_no", queryObj)

        // Add text search filters
        addTextFilter(devata, "devata", queryObj)
        addTextFilter(rishi, "rishi", queryObj)
        addTextFilter(chhanda, "chhanda", queryObj)
        addTextFilter(swara, "swara", queryObj)
        addTextFilter(mantra, "mantra", queryObj)
        addTextFilter(mantra_swara, "mantra_swara", queryObj)
        addTextFilter(mantra_pad, "mantra_pad", queryObj)
        addTextFilter(mantra_pad_swara, "mantra_pad_swara", queryObj)
        addTextFilter(mantra_trans, "mantra_trans", queryObj)

        // Perform the query
        const result: RigVeda[] = await collection.find(queryObj).limit(ITEM_LIMIT).toArray()

        res.status(200).json({ message: "Data fetched successfully", data: result })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: "Error fetching data from the database" })
    }
}