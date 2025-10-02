import { MongoClient, Db } from "mongodb"
import { MONGODB_DB_NAME, MONGODB_URI } from "./consts"
import { Veda } from "@/types/vedas";



let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getVedaKoshaDB(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = await MongoClient.connect(MONGODB_URI!);
  }

  cachedDb = cachedClient.db(MONGODB_DB_NAME);
  console.log(`cachedDb: ${cachedDb.databaseName}
    MONGODB_DB_NAME: ${cachedDb.collections()}
    ${cachedDb.listCollections().toArray()}`)
  return cachedDb;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addTextFilterX<T>(param: string | null, field: keyof T, queryObj: Record<string, any>) {
  if (param && param.trim()) {
    queryObj[field as string] = { $regex: param.trim(), $options: "i" }
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addNumberFilterX<T>(param: string | null, field: keyof T, queryObj: Record<string, any>) {
  if (param) {
    const value = Number.parseInt(param, 10)
    if (!isNaN(value)) {
      queryObj[field as string] = value
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addNumberFilter = <T extends Veda>(param: string | null,
  field: keyof T, queryObj: Record<string, any>) => {
 if (param) {
     const value = Number.parseInt(param, 10)
     if (!isNaN(value)) {
         queryObj[field as string] = value
     }
 }
}

// Helper function to add text search filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addTextFilter = <T extends Veda>(param: string | null, 
 field: keyof T, queryObj: Record<string, any>) => {
 if (param && param.trim()) {
     queryObj[field as string] = { $regex: param.trim(), $options: "i" }
 }
}