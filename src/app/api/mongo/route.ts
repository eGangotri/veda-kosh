import { NextResponse } from "next/server"
import type { MongoClient, Db, Collection } from "mongodb"
import clientPromise from "../../../lib/mongodb"
import { MONGODB_DB_NAME, RIG_VEDA } from "../consts"


//http://192.168.1.167:3000/api/mongo
export async function GET() {
  try {
    const client: MongoClient = await clientPromise
    const db: Db = client.db(MONGODB_DB_NAME)

    // Perform a simple query
    const collection: Collection<DocumentType> = db.collection(RIG_VEDA)
    const result: DocumentType[] = await collection.find({}).limit(10).toArray()

    return NextResponse.json({ message: "Connected successfully", data: result })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Error connecting to the database" }, { status: 500 })
  }
}

