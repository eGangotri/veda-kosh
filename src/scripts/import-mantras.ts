import { promises as fs } from "fs"
import * as path from "path"
import { parse } from "csv-parse"
import { MongoClient } from "mongodb"
import type { Mantra } from "../types/mantra"

async function importMantras() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please provide MONGODB_URI in your environment variables")
  }

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI)
    const db = client.db("rigveda")
    const collection = db.collection<Mantra>("mantras")

    // Read and parse the CSV file
    const fileContent = await fs.readFile(path.join(process.cwd(), "data", "rigveda.csv"), "utf-8")

    // Parse CSV
    const records: Mantra[] = await new Promise((resolve, reject) => {
      parse(
        fileContent,
        {
          columns: true,
          skip_empty_lines: true,
          cast: (value, context) => {
            // Convert numeric fields to numbers
            const numericFields = [
              "mandal_no",
              "sukta_no",
              "mantra_no",
              "ashtak_no",
              "adhyay_no",
              "varga_no",
              "mantra2_no",
              "mandal2_no",
              "anuvak_no",
              "mantra3_no",
            ]
            return value
          },
        },
        (err, result) => {
          if (err) reject(err)
          resolve(result)
        },
      )
    })

    // Insert the records
    const result = await collection.insertMany(records)
    console.log(`Successfully imported ${result.insertedCount} mantras`)

    // Create indexes for better query performance
    await collection.createIndex({ mantra_ref_id: 1 }, { unique: true })
    await collection.createIndex({ mandal_no: 1, sukta_no: 1, mantra_no: 1 })

    await client.close()
    console.log("Import completed successfully")
  } catch (error) {
    console.error("Error importing mantras:", error)
    process.exit(1)
  }
}

// Run the import
importMantras()

