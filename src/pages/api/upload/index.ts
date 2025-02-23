import { getVedaKoshaDB } from '../Utils'
import type { NextApiRequest, NextApiResponse } from 'next'
import XLSX from 'xlsx';
import { ExcelRow, UploadResponse } from "@/types/upload"
import { IncomingForm, Fields, Files, File } from 'formidable'
import fs from 'fs'
import { Db, Collection } from 'mongodb'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UploadResponse>
): Promise<void> {
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Method not allowed' })
        return
    }

    try {
        const allowOverwrite = req.query.allowOverwrite === "true"

        const form = new IncomingForm()

        form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
            if (err) {
                console.error('Form parsing error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Failed to process file',
                    error: 'Error parsing form data',
                })
                return
            }

            const fileArray = files.file
            if (!fileArray || (Array.isArray(fileArray) && fileArray.length === 0)) {
                res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                    error: 'File is required',
                })
                return
            }

            const file: File = Array.isArray(fileArray) ? fileArray[0] : fileArray

            // Read the file buffer
            const buffer = fs.readFileSync(file.filepath)

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
            const collectionName = file.originalFilename
                ?.replace(/\.[^/.]+$/, "")
                .replace(/\s+/g, "_")
                .toLowerCase()

            if (!collectionName) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid file name',
                    error: 'Unable to determine collection name from file',
                })
                return
            }

            const vedaKoshaDB: Db = await getVedaKoshaDB()
            // Check if collection exists
            const collections = await vedaKoshaDB.listCollections({ name: collectionName }).toArray()
            const collectionExists = collections.length > 0

            if (collectionExists && !allowOverwrite) {
                return res.status(400).json({
                    success: false,
                    message: `Collection '${collectionName}' already exists. Data not inserted.`,
                    error: "Collection already exists",
                    collectionCreated: false,
                    recordsInserted: 0,
                })
            }
            if (!collectionExists) {
                // Insert data
                const collection: Collection<ExcelRow> = vedaKoshaDB.collection(collectionName)
                const result = await collection.insertMany(processedData)

                res.status(200).json({
                    success: true,
                    message: `Successfully uploaded ${result.insertedCount} records to ${collectionName}`,
                    collectionCreated: !collectionExists,
                    recordsInserted: result.insertedCount,
                })
            }
            else {
                // Overwrite data
                const collection: Collection<ExcelRow> = vedaKoshaDB.collection(collectionName)
                const deleteResult = await collection.deleteMany({})
                const result = await collection.insertMany(processedData)

                res.status(200).json({
                    success: true,
                    message: `Existing ${deleteResult.deletedCount} records were deleted. New ${result.insertedCount} records were added to ${collectionName}`,
                    collectionCreated: !collectionExists,
                    recordsInserted: result.insertedCount,
                })
            }
        })



    } catch (error) {
        console.error("Upload error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to process file",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        })
    }
}