import type { NextApiRequest, NextApiResponse } from 'next'
import { RigVedaModel } from "../../../../models/RigVeda"
import { RigVeda } from "@/types/vedas"
import { connectToDatabase } from "@/utils/mongoose"
import { ITEM_LIMIT } from "../../consts"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  await connectToDatabase()

  console.log(`GET /api/vedas/rigveda`)
  try {
    // Get query parameters
    const {
      mandal_no, sukta_no, mantra_no, ashtak_no, adhyay_no, varga_no, mantra2_no,
      devata, rishi, chhanda, swara, mantra, mantra_swara, mantra_pad, mantra_pad_swara, mantra_trans
    } = req.query

    // Build query object
    const query: Record<string, any> = {}

    // Helper function to safely parse and add number filters
    const addNumberFilter = (param: string | string[] | undefined, field: keyof RigVeda) => {
      if (param) {
        const value = Number.parseInt(Array.isArray(param) ? param[0] : param, 10)
        if (!isNaN(value)) {
          query[field] = value
        }
      }
    }

    // Helper function to add text search filters
    const addTextFilter = (param: string | string[] | undefined, field: keyof RigVeda) => {
      if (param) {
        const value = Array.isArray(param) ? param[0] : param
        if (value.trim()) {
          query[field] = { $regex: value.trim(), $options: "i" }
        }
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

    console.log('Query:', JSON.stringify(query, null, 2))
    console.log('Search params:', req.query)

    // Perform the query
    const result = await RigVedaModel.find(query).limit(ITEM_LIMIT).exec()
    console.log(`Found ${result.length} mantras`)
    return res.status(200).json({ message: "Data fetched successfully", data: result })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: "Error fetching data from the database" })
  }
}