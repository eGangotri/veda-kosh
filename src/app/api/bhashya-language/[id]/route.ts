import { NextRequest, NextResponse } from "next/server"
import { Collection, ObjectId } from "mongodb"
import { getVedaKoshaDB } from "../../lib/utils";
import { BhashyaLanguage } from "@/types/BhashyaLanguage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<BhashyaLanguage> = vedaKoshaDB.collection("veda-kosha-bhashya-language");
    const _params = await params

    // Fetch bhashya entry by ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bhashyaMetadata = await collection.findOne({
      "_id": new ObjectId(_params.id)
    } as any) // Use type assertion to bypass TypeScript's type checking

    if (!bhashyaMetadata) {
      return NextResponse.json({ error: "Bhashya language not found" }, { status: 404 })
    }

    return NextResponse.json(bhashyaMetadata)
  } catch (error) {
    console.error("Error fetching bhashya language:", error)
    return NextResponse.json({ error: "Failed to fetch bhashya language" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const _params = await params
    const bhashyaLanguage = await request.json()

    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<BhashyaLanguage> = vedaKoshaDB.collection("veda-kosha-bhashya-language");

    // Remove _id from the update data if it exists
    if (bhashyaLanguage._id) {
      delete bhashyaLanguage._id;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await collection.updateOne(
      { "_id": new ObjectId(_params.id) } as any, // Use type assertion
      { $set: bhashyaLanguage }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Bhashya language not found" }, { status: 404 })
    }

    return NextResponse.json({ ...bhashyaLanguage, _id: _params.id })
  } catch (error) {
    console.error("Error updating bhashya language:", error)
    return NextResponse.json({ error: "Failed to update bhashya language" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const _params = await params

    const vedaKoshaDB = await getVedaKoshaDB();
    const collection: Collection<BhashyaLanguage> = vedaKoshaDB.collection("veda-kosha-bhashya-language");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await collection.deleteOne({
      "_id": new ObjectId(_params.id)
    } as any) // Use type assertion

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Bhashya language not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bhashya language:", error)
    return NextResponse.json({ error: "Failed to delete bhashya language" }, { status: 500 })
  }
}
