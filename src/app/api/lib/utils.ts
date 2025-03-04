import { MongoClient, Db } from "mongodb"
import { MONGODB_DB_NAME } from "./consts"

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

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
  return cachedDb;
}

export function addTextFilter<T>(param: string | null, field: keyof T, queryObj: Record<string, any>) {
  if (param && param.trim()) {
    queryObj[field as string] = { $regex: param.trim(), $options: "i" }
  }
}

export function addNumberFilter<T>(param: string | null, field: keyof T, queryObj: Record<string, any>) {
  if (param) {
    const value = Number.parseInt(param, 10)
    if (!isNaN(value)) {
      queryObj[field as string] = value
    }
  }
}
