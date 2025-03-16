import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { Collection } from "mongoose";
import { BhashyaLanguage } from "@/types/BhashyaLanguage";
import { getVedaKoshaDB } from "../lib/utils";

export async function GET() {
  try {
    //const bhashyaLanguages = await db.collection().find({}).toArray()

    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<BhashyaLanguage> = vedaKoshaDB.collection("veda-kosha-bhashya-language");
  
    // Fetch all bhashya entries
    const bhashyas = await collection.find({}).toArray();
  
    return NextResponse.json(bhashyas)
  } catch (error) {
    console.error("Error fetching bhashya languages:", error)
    return NextResponse.json({ error: "Failed to fetch bhashya languages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const bhashyaLanguage = await request.json()
    
    const client = await clientPromise
    const db = client.db()
    
    const result = await db.collection("veda-kosha-bhashya-language").insertOne(bhashyaLanguage)
    
    return NextResponse.json({ 
      _id: result.insertedId,
      ...bhashyaLanguage 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating bhashya language:", error)
    return NextResponse.json({ error: "Failed to create bhashya language" }, { status: 500 })
  }
}
