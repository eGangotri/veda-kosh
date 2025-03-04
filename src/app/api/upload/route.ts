import { getVedaKoshaDB } from "../lib/utils"
import { NextRequest, NextResponse } from 'next/server'
import type { ExcelRow, UploadResponse } from "@/types/upload"
import { IncomingForm, Fields, Files, File } from 'formidable'
import fs from 'fs'
import type { Db, Collection } from 'mongodb'
import XLSX from 'xlsx'

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  const allowOverwrite = request.nextUrl.searchParams.get('allowOverwrite') === 'true'

  try {
    // Since we can't use formidable directly with Edge Runtime,
    // we need to handle the form data using Web API
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file uploaded',
        error: 'File is required',
      }, { status: 400 })
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[]

    // Process headers to convert spaces to underscores and lowercase
    const processedData: ExcelRow[] = jsonData.map((row) => {
      const processedRow: ExcelRow = {}
      Object.entries(row).forEach(([key, value]) => {
        const processedKey = key.toLowerCase().replace(/\s+/g, "_")
        processedRow[processedKey] = value
      })
      return processedRow
    })

    // Convert Excel filename to collection name
    const collectionName = file.name
      ?.replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "_")
      .toLowerCase()

    if (!collectionName) {
      return NextResponse.json({
        success: false,
        message: 'Invalid file name',
        error: 'Unable to determine collection name from file',
      }, { status: 400 })
    }

    const vedaKoshaDB: Db = await getVedaKoshaDB()
    // Check if collection exists
    const collections = await vedaKoshaDB.listCollections({ name: collectionName }).toArray()
    const collectionExists = collections.length > 0

    if (collectionExists && !allowOverwrite) {
      return NextResponse.json({
        success: false,
        message: `Collection '${collectionName}' already exists. Data not inserted.`,
        error: "Collection already exists",
        collectionCreated: false,
        recordsInserted: 0,
      }, { status: 400 })
    }

    const collection: Collection<ExcelRow> = vedaKoshaDB.collection(collectionName)

    if (collectionExists) {
      // Overwrite data
      const deleteResult = await collection.deleteMany({})
      const result = await collection.insertMany(processedData)

      return NextResponse.json({
        success: true,
        message: `Existing ${deleteResult.deletedCount} records were deleted. New ${result.insertedCount} records were added to ${collectionName}`,
        collectionCreated: false,
        recordsInserted: result.insertedCount,
      })
    } else {
      // Insert data
      const result = await collection.insertMany(processedData)

      return NextResponse.json({
        success: true,
        message: `Successfully uploaded ${result.insertedCount} records to ${collectionName}`,
        collectionCreated: true,
        recordsInserted: result.insertedCount,
      })
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to process file",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }, { status: 500 })
  }
}

// Configure the API route to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}
