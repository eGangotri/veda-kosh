import type { MongoClient, Db, Collection } from "mongodb"
import clientPromise from "../../lib/mongodb"
import { MONGODB_DB_NAME } from "./consts";


export const getVedaKoshaDB = async () => {
    const client: MongoClient = await clientPromise
    const vedaKoshaDB: Db = client.db(MONGODB_DB_NAME)
    return vedaKoshaDB
}