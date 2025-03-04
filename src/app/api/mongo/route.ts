import { NextResponse } from "next/server"
import type { Collection } from "mongodb"
import { RIG_VEDA } from "../../lib/consts"
import { getVedaKoshaDB } from "../../lib/utils"
import { connectToDatabaseVIaMongoose } from "@/utils/mongoose"

export async function GET() {
  await connectToDatabaseVIaMongoose()
  
  try {
    const vedaKoshaDB = await getVedaKoshaDB();
    // Perform a simple query
    const collection: Collection = vedaKoshaDB.collection(RIG_VEDA)
    const result = await collection.find({}).limit(10).toArray()

    return NextResponse.json({
      message: "Connected successfully",
      data: result
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Error connecting to the database" },
      { status: 500 }
    )
  }
}
