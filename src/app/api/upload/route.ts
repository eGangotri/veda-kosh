

// Connect to MongoDB

import { NextResponse } from "next/server"
import * as XLSX from "xlsx"
import clientPromise from "@/lib/mongodb"
import type { UploadResponse, ExcelRow } from "@/types/upload"
import { getVedaKoshaDB } from "../Utils"

export async function POST(req: Request): Promise<NextResponse<UploadResponse>> {
    try {
        const { searchParams } = new URL(req.url)
        const preventOverwrite = searchParams.get("preventOverwrite") === "true"

        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No file uploaded",
                    error: "File is required",
                },
                { status: 400 },
            )
        }

        // Read the file buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Parse Excel file
        const workbook = XLSX.read(buffer, { type: "buffer" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[]

        // Process headers to convert spaces to underscores and lowercase
        const processedData = jsonData.map((row) => {
            const processedRow: ExcelRow = {}
            Object.entries(row).forEach(([key, value]) => {
                const processedKey = key.toLowerCase().replace(/\s+/g, "_")
                processedRow[processedKey] = value
            })
            return processedRow
        })

        // Convert Excel filename to collection name
        const collectionName = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/\s+/g, "_")
            .toLowerCase()

        const vedaKoshaDB = await getVedaKoshaDB();
        // Check if collection exists
        const collections = await vedaKoshaDB.listCollections({ name: collectionName }).toArray()
        const collectionExists = collections.length > 0

        if (collectionExists && preventOverwrite) {
            return NextResponse.json({
                success: false,
                message: `Collection '${collectionName}' already exists. Data not inserted.`,
                error: "Collection already exists",
                collectionCreated: false,
                recordsInserted: 0,
            })
        }

        // Insert data
        const collection = vedaKoshaDB.collection(collectionName)
        const result = await collection.insertMany(processedData)

        return NextResponse.json({
            success: true,
            message: `Successfully uploaded ${result.insertedCount} records to ${collectionName}`,
            collectionCreated: !collectionExists,
            recordsInserted: result.insertedCount,
        })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to process file",
                error: error instanceof Error ? error.message : "Unknown error occurred",
            },
            { status: 500 },
        )
    }
}

