import { NextApiRequest, NextApiResponse } from "next"
import type { YajurVeda } from "@/types/vedas" // Update the import to use YajurVeda
import type { Collection } from "mongodb"
import { getVedaKoshaDB } from "../Utils"
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

        // Helper function to safely parse and add number filters
        const addNumberFilter = (param: string | null, field: keyof YajurVeda) => {
            if (param) {
                const value = Number.parseInt(param, 10)
                if (!isNaN(value)) {
                    queryObj[field] = value as any
                }
            }
        }

        // Helper function to add text search filters
        const addTextFilter = (param: string | null, field: keyof YajurVeda) => {
            if (param && param.trim()) {
                queryObj[field] = { $regex: param.trim(), $options: "i" }
            }
        }

        // Add numeric filters
        addNumberFilter(adhyay_no, "adhyay_no")
        addNumberFilter(mantra_no, "mantra_no")

        // Add text search filters
        addTextFilter(mantra_ref_id, "mantra_ref_id")
        addTextFilter(mantra, "mantra")
        addTextFilter(mantra_swara, "mantra_swara")
        addTextFilter(mantra_pad, "mantra_pad")
        addTextFilter(mantra_pad_swara, "mantra_pad_swara")
        addTextFilter(devata, "devata")
        addTextFilter(rishi, "rishi")
        addTextFilter(chhanda, "chhanda")
        addTextFilter(swara, "swara")

        // Perform the query
        const result: YajurVeda[] = await collection.find(queryObj).limit(ITEM_LIMIT).toArray()

        res.status(200).json({ message: "Data fetched successfully", data: result })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: "Error fetching data from the database" })
    }
}