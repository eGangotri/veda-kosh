import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { Collection } from 'mongodb';
import { BhashyaLanguage } from "@/types/BhashyaLanguage";
import { getVedaKoshaDB } from "../lib/utils";

export async function GET() {
  try {

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
    
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<BhashyaLanguage> = vedaKoshaDB.collection("veda-kosha-bhashya-language");
    
    // Remove _id if it exists in the request body to let MongoDB generate a new one
    if (bhashyaLanguage._id) {
      delete bhashyaLanguage._id;
    }
    
    const result = await collection.insertOne(bhashyaLanguage);
    
    return NextResponse.json({ 
      _id: result.insertedId.toString(),
      ...bhashyaLanguage 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating bhashya language:", error)
    return NextResponse.json({ error: "Failed to create bhashya language" }, { status: 500 })
  }
}
