import type { NextRequest } from "next/server"
import { RigVedaModel } from "@/models/RigVeda"
import type { RigVeda } from "@/types/vedas"
import { connectToDatabase } from "@/utils/mongoose"
import { ITEM_LIMIT } from "@/app/api/consts"
import mongoose from "mongoose"

export const runtime = "nodejs" // Specify Node.js runtime

export async function GET(request: NextRequest) {
  console.log(`GET /api/vedas/rigveda`)
  try {
    await connectToDatabase()

    console.log("MongoDB connection state:", mongoose.connection.readyState)
    console.log("MongoDB connection URL:", mongoose.connection.host)
    console.log("Database name:", mongoose.connection.name)

    if (!mongoose.connection.db) {
      throw new Error("Database connection is not established")
    }
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log(
      "Collections in the database:",
      collections.map((c) => c.name),
    )

    console.log("RigVedaModel collection name:", RigVedaModel.collection.name)

    const count = await RigVedaModel.countDocuments()
    console.log(`Total documents in RigVeda collection: ${count}`)

    const searchParams = request.nextUrl.searchParams
    console.log("Query:", JSON.stringify(Object.fromEntries(searchParams), null, 2))

    const result = await RigVedaModel.find({}).limit(ITEM_LIMIT).lean().exec()

    console.log(`Found ${result.length} mantras`)

    if (result.length > 0) {
      console.log("Sample document:", JSON.stringify(result[0], null, 2))
    } else {
      console.log("No documents found. Checking for any document in the collection...")
      const anyDocument = await RigVedaModel.findOne().lean().exec()
      if (anyDocument) {
        console.log("Found a document:", JSON.stringify(anyDocument, null, 2))
      } else {
        console.log("The collection appears to be empty.")
      }
    }

    // Build query object
    const query: Record<string, any> = {}

    // Helper function to safely parse and add number filters
    const addNumberFilter = (param: string | null, field: keyof RigVeda) => {
      if (param) {
        const value = Number.parseInt(param, 10)
        if (!isNaN(value)) {
          query[field] = value
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
    addNumberFilter(searchParams.get("mandal_no"), "mandal_no")
    addNumberFilter(searchParams.get("sukta_no"), "sukta_no")
    addNumberFilter(searchParams.get("mantra_no"), "mantra_no")
    addNumberFilter(searchParams.get("ashtak_no"), "ashtak_no")
    addNumberFilter(searchParams.get("adhyay_no"), "adhyay_no")
    addNumberFilter(searchParams.get("varga_no"), "varga_no")
    addNumberFilter(searchParams.get("mantra2_no"), "mantra2_no")

    // Add text search filters
    addTextFilter(searchParams.get("devata"), "devata")
    addTextFilter(searchParams.get("rishi"), "rishi")
    addTextFilter(searchParams.get("chhanda"), "chhanda")
    addTextFilter(searchParams.get("swara"), "swara")
    addTextFilter(searchParams.get("mantra"), "mantra")
    addTextFilter(searchParams.get("mantra_swara"), "mantra_swara")
    addTextFilter(searchParams.get("mantra_pad"), "mantra_pad")
    addTextFilter(searchParams.get("mantra_pad_swara"), "mantra_pad_swara")
    addTextFilter(searchParams.get("mantra_trans"), "mantra_trans")

    console.log("Query:", JSON.stringify(query, null, 2))
    console.log("Search params:", Object.fromEntries(searchParams))

    const result2 = await RigVedaModel.find({}).limit(ITEM_LIMIT).exec()
    // Perform the query
    const result3 = await RigVedaModel.find(query).limit(ITEM_LIMIT).exec()

    console.log(`Found ${result2.length} mantras`)
    console.log(`Found ${result3.length} mantras`)

    return Response.json({ message: "Data fetched successfully..", data: result })
  } catch (e) {
    console.error(e)
    return Response.json({ message: "Error fetching data from the database" }, { status: 500 })
  }
}

