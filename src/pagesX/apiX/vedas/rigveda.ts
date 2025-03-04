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
        // Build query object
        const queryObj: Record<string, any> = {}

        // Get query parameters and add filters
        const { query } = req
        if (query.mantra_ref_id) {
            addTextFilter<RigVeda>(query.mantra_ref_id as string, "mantra_ref_id", queryObj)
        }
        else {
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

            // Add numeric filters
            addNumberFilter<RigVeda>(mandal_no, "mandal_no", queryObj)
            addNumberFilter<RigVeda>(sukta_no, "sukta_no", queryObj)
            addNumberFilter<RigVeda>(mantra_no, "mantra_no", queryObj)
            addNumberFilter<RigVeda>(ashtak_no, "ashtak_no", queryObj)
            addNumberFilter<RigVeda>(adhyay_no, "adhyay_no", queryObj)
            addNumberFilter<RigVeda>(varga_no, "varga_no", queryObj)
            addNumberFilter<RigVeda>(mantra2_no, "mantra2_no", queryObj)

            // Add text search filters
            addTextFilter<RigVeda>(devata, "devata", queryObj)
            addTextFilter<RigVeda>(rishi, "rishi", queryObj)
            addTextFilter<RigVeda>(chhanda, "chhanda", queryObj)
            addTextFilter<RigVeda>(swara, "swara", queryObj)
            addTextFilter<RigVeda>(mantra, "mantra", queryObj)
            addTextFilter<RigVeda>(mantra_swara, "mantra_swara", queryObj)
            addTextFilter<RigVeda>(mantra_pad, "mantra_pad", queryObj)
            addTextFilter<RigVeda>(mantra_pad_swara, "mantra_pad_swara", queryObj)
            addTextFilter<RigVeda>(mantra_trans, "mantra_trans", queryObj)
        }

        // Perform the query
        const result: RigVeda[] = await collection.find(queryObj).limit(ITEM_LIMIT).toArray()

        res.status(200).json({ message: "Data fetched successfully", data: result })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: "Error fetching data from the database" })
    }
}