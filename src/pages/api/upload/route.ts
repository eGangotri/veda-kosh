import type { NextApiRequest, NextApiResponse } from 'next'
import * as XLSX from "xlsx"
import { getVedaKoshaDB } from "../Utils"
import { ExcelRow, UploadResponse } from "@/types/upload"
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const preventOverwrite = req.query.preventOverwrite === "true"

    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err)
        return res.status(500).json({
          success: false,
          message: 'Failed to process file',
          error: 'Error parsing form data',
        })
      }

      const file = files.file as formidable.File
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
          error: 'File is required',
        })
      }

      // Read the file buffer
      const buffer = fs.readFileSync(file.filepath)

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
      const collectionName = file.originalFilename
        ?.replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "_")
        .toLowerCase()

      if (!collectionName) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file name',
          error: 'Unable to determine collection name from file',
        })
      }

      const vedaKoshaDB = await getVedaKoshaDB()
      // Check if collection exists
      const collections = await vedaKoshaDB.listCollections({ name: collectionName }).toArray()
      const collectionExists = collections.length > 0

      if (collectionExists && preventOverwrite) {
        return res.status(400).json({
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

      return res.status(200).json({
        success: true,
        message: `Successfully uploaded ${result.insertedCount} records to ${collectionName}`,
        collectionCreated: !collectionExists,
        recordsInserted: result.insertedCount,
      })
    })
  } catch (error) {
    console.error("Upload error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to process file",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}