import { NextResponse } from "next/server"
import type { MongoClient, Db, Collection } from "mongodb"
import clientPromise from "../../../lib/mongodb"
import { MONGODB_DB_NAME, RIG_VEDA } from "../consts"
import { getVedaKoshaDB } from "../Utils"
import { connectToDatabase } from "@/utils/mongoose";


//http://192.168.1.167:3000/api/mongo
export async function GET() {
   await connectToDatabase()
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

