import { getVedaKoshaDB } from "../lib/utils"
import { NextRequest, NextResponse } from 'next/server'
import type { ExcelRow, UploadResponse } from "@/types/upload"
import fs from 'fs'
import type { Db, Collection } from 'mongodb'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  const allowOverwrite = request.nextUrl.searchParams.get('allowOverwrite') === 'true'

  try {
    // Since we can't use formidable directly with Edge Runtime,
    // we need to handle the form data using Web API
    const formData = await request.formData()
    const file = formData.get('file') as globalThis.File;

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
    
    // Check if the first row is empty and use second row as header if needed
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1')
    let firstRowEmpty = true
    
    // Check if first row cells are all empty
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: C })
      if (worksheet[cellAddress] && worksheet[cellAddress].v !== undefined && worksheet[cellAddress].v !== '') {
        firstRowEmpty = false
        break
      }
    }
    
    let jsonData: ExcelRow[]
    
    if (firstRowEmpty && range.e.r > 0) {
      // If first row is empty, use the second row as header
      // First, create a new worksheet with the second row as the header
      const newWorksheet: XLSX.WorkSheet = { '!ref': worksheet['!ref'] || 'A1:A1' }
      
      // Copy the column properties
      if (worksheet['!cols']) newWorksheet['!cols'] = worksheet['!cols']
      if (worksheet['!rows']) newWorksheet['!rows'] = worksheet['!rows']
      
      // Get second row (index 1) as headers
      const headers: string[] = []
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: range.s.r + 1, c: C })
        const headerValue = worksheet[cellAddress]?.v || `Column${C + 1}`
        headers[C] = headerValue.toString()
      }
      
      // Copy data starting from the third row (index 2)
      for (let R = range.s.r + 2; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const srcAddress = XLSX.utils.encode_cell({ r: R, c: C })
          const dstAddress = XLSX.utils.encode_cell({ r: R - 2, c: C })
          if (worksheet[srcAddress]) newWorksheet[dstAddress] = worksheet[srcAddress]
        }
      }
      
      // Update the range to reflect the new data (minus the first two rows)
      if (range.e.r > 1) {
        newWorksheet['!ref'] = XLSX.utils.encode_range({
          s: { r: 0, c: range.s.c },
          e: { r: range.e.r - 2, c: range.e.c }
        })
      }
      
      // Convert to JSON with custom headers
      jsonData = XLSX.utils.sheet_to_json(newWorksheet, { header: headers }) as ExcelRow[]
    } else {
      // Use normal parsing if first row is not empty
      jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[]
    }

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
