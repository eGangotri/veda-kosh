import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const client = await clientPromise
    const db = client.db()
    
    const bhashyaLanguage = await db.collection("veda-kosha-bhashya-language").findOne({
      _id: new ObjectId(id)
    })
    
    if (!bhashyaLanguage) {
      return NextResponse.json({ error: "Bhashya language not found" }, { status: 404 })
    }
    
    return NextResponse.json(bhashyaLanguage)
  } catch (error) {
    console.error("Error fetching bhashya language:", error)
    return NextResponse.json({ error: "Failed to fetch bhashya language" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const bhashyaLanguage = await request.json()
    
    const client = await clientPromise
    const db = client.db()
    
    const result = await db.collection("veda-kosha-bhashya-language").updateOne(
      { _id: new ObjectId(id) },
      { $set: bhashyaLanguage }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Bhashya language not found" }, { status: 404 })
    }
    
    return NextResponse.json({ ...bhashyaLanguage, _id: id })
  } catch (error) {
    console.error("Error updating bhashya language:", error)
    return NextResponse.json({ error: "Failed to update bhashya language" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const client = await clientPromise
    const db = client.db()
    
    const result = await db.collection("veda-kosha-bhashya-language").deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Bhashya language not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bhashya language:", error)
    return NextResponse.json({ error: "Failed to delete bhashya language" }, { status: 500 })
  }
}
