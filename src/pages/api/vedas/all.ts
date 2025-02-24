import { NextApiRequest, NextApiResponse } from "next"
import type { RigVeda, YajurVeda, SamaVeda, AtharvaVeda, VedaResultType } from "@/types/vedas"
import type { Collection } from "mongodb"
import { addTextFilter, getVedaKoshaDB } from "../Utils"
import { ITEM_LIMIT, RIG_VEDA, YAJUR_VEDA, SAMA_VEDA, ATHARVA_VEDA } from "../consts"



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: VedaResultType }>
) {
  try {
    const vedaKoshaDB = await getVedaKoshaDB();

    const rigVedaCollection: Collection<RigVeda> = vedaKoshaDB.collection(RIG_VEDA)
    const yajurVedaCollection: Collection<YajurVeda> = vedaKoshaDB.collection(YAJUR_VEDA)
    const samaVedaCollection: Collection<SamaVeda> = vedaKoshaDB.collection(SAMA_VEDA)
    const atharvaVedaCollection: Collection<AtharvaVeda> = vedaKoshaDB.collection(ATHARVA_VEDA)

    // Get query parameters
    const { query } = req
    const mantra = query.mantra as string

    // Build query object for mantra search
    const queryObj: Record<string, any> = {}
    addTextFilter(mantra, "mantra", queryObj);

    console.log(`queryObj: ${JSON.stringify(queryObj)}`)
    // Perform the queries
    const [rigVedaResults, yajurVedaResults, samaVedaResults, atharvaVedaResults] = await Promise.all([
      rigVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray(),
      yajurVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray(),
      samaVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray(),
      atharvaVedaCollection.find(queryObj).limit(ITEM_LIMIT).toArray()
    ])
    console.log(`lenths : ${rigVedaResults.length} ${yajurVedaResults.length} ${samaVedaResults.length} ${atharvaVedaResults.length}`)
    res.status(200).json({ message: "Data fetched successfully", data: { rigVedaResults, yajurVedaResults, samaVedaResults, atharvaVedaResults } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Error fetching data from the database" })
  }
}