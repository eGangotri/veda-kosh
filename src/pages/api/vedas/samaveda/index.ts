import { type NextRequest, NextResponse } from "next/server"
import type { SamaVeda } from "@/types/vedas"
import { connectToDatabase } from "@/utils/mongoose"
import { SamaVedaModel } from "@/models/SamaVeda"
import { ITEM_LIMIT } from "../../consts"

export async function GET(request: NextRequest) {
  await connectToDatabase()

  console.log(`GET /api/vedas/samaveda`)
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const archik_no = searchParams.get("archik_no")
    const prapathak = searchParams.get("prapathak")
    const ardh_prapathak = searchParams.get("ardh_prapathak")
    const dashti_no = searchParams.get("dashti_no")
    const mantra_no = searchParams.get("mantra_no")
    const adhyay_no = searchParams.get("adhyay_no")
    const khand_no = searchParams.get("khand_no")
    const mantra2_no = searchParams.get("mantra2_no")
    const mantra_sankhya = searchParams.get("mantra_sankhya")

    // Text search parameters
    const devata = searchParams.get("devata")
    const rishi = searchParams.get("rishi")
    const chhanda = searchParams.get("chhanda")
    const swara = searchParams.get("swara")
    const mantra = searchParams.get("mantra")
    const mantra_swara = searchParams.get("mantra_swara")
    const mantra_pad = searchParams.get("mantra_pad")
    const mantra_pad_swara = searchParams.get("mantra_pad_swara")
    const kand_name = searchParams.get("kand_name")
    const gaan = searchParams.get("gaan")
    const gaan_parva = searchParams.get("gaan_parva")

    // Build query object
    const query: Record<string, any> = {}

    // Helper function to safely parse and add number filters
    const addNumberFilter = (param: string | null, field: keyof SamaVeda) => {
      if (param) {
        const value = Number.parseInt(param, 10)
        if (!isNaN(value)) {
          query[field] = value
        }
      }
    }

    // Helper function to add text search filters
    const addTextFilter = (param: string | null, field: keyof SamaVeda) => {
      if (param && param.trim()) {
        query[field] = { $regex: param.trim(), $options: "i" }
      }
    }

    // Add numeric filters
    addNumberFilter(archik_no, "archik_no")
    addNumberFilter(prapathak, "prapathak")
    addNumberFilter(ardh_prapathak, "ardh_prapathak")
    addNumberFilter(dashti_no, "dashti_no")
    addNumberFilter(mantra_no, "mantra_no")
    addNumberFilter(adhyay_no, "adhyay_no")
    addNumberFilter(khand_no, "khand_no")
    addNumberFilter(mantra2_no, "mantra2_no")
    addNumberFilter(mantra_sankhya, "mantra_sankhya")

    // Add text search filters
    addTextFilter(devata, "devata")
    addTextFilter(rishi, "rishi")
    addTextFilter(chhanda, "chhanda")
    addTextFilter(swara, "swara")
    addTextFilter(mantra, "mantra")
    addTextFilter(mantra_swara, "mantra_swara")
    addTextFilter(mantra_pad, "mantra_pad")
    addTextFilter(mantra_pad_swara, "mantra_pad_swara")
    addTextFilter(kand_name, "kand_name")
    addTextFilter(gaan, "gaan")
    addTextFilter(gaan_parva, "gaan_parva")

    console.log("Query:", JSON.stringify(query, null, 2))
    console.log("Search params:", Object.fromEntries(searchParams.entries()))

    // Perform the query
    const result = await SamaVedaModel.find(query).limit(ITEM_LIMIT).exec()
    console.log(`Found ${result.length} mantras`)
    return NextResponse.json({ message: "Data fetched successfully", data: result })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Error fetching data from the database" }, { status: 500 })
  }
}

