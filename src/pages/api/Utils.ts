import type { MongoClient, Db, Collection } from "mongodb"
import clientPromise from "../../lib/mongodb"
import { MONGODB_DB_NAME } from "./consts";
import { Veda } from "@/types/vedas";


export const getVedaKoshaDB = async () => {
    const client: MongoClient = await clientPromise
    const vedaKoshaDB: Db = client.db(MONGODB_DB_NAME)
    return vedaKoshaDB
}

// Helper function to safely parse and add number filters
export const addNumberFilter = (param: string | null, field: keyof Veda, queryObj: Record<string, any>) => {
    if (param) {
        const value = Number.parseInt(param, 10)
        if (!isNaN(value)) {
            queryObj[field] = value as any
        }
    }
}

// Helper function to add text search filters
export const addTextFilter = (param: string | null, field: keyof Veda, queryObj: Record<string, any>) => {
    if (param && param.trim()) {
        queryObj[field] = { $regex: param.trim(), $options: "i" }
    }
}