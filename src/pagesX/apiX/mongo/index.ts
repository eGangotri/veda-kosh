import { NextResponse } from "next/server"
import type { Collection } from "mongodb"
import { connectToDatabaseVIaMongoose } from "@/utils/mongoose";
import { getVedaKoshaDB } from "@/app/api/lib/utils";
import { RIG_VEDA } from "@/app/api/lib/consts";


//http://192.168.1.167:3000/api/mongo
export async function GET() {
   await connectToDatabaseVIaMongoose()
  try {
    const vedaKoshaDB = await getVedaKoshaDB();
    // Perform a simple query
    const collection: Collection<DocumentType> = vedaKoshaDB.collection(RIG_VEDA)
    const result: DocumentType[] = await collection.find({}).limit(10).toArray()

    return NextResponse.json({ message: "Connected successfully", data: result })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Error connecting to the database" }, { status: 500 })
  }
}

