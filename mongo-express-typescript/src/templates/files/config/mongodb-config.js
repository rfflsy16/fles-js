export default `import { MongoClient } from 'mongodb'
import config from './mongodb.json'
import dotenv from 'dotenv'

dotenv.config()

// Use URI from environment variable if available, otherwise use from config
const uri = process.env.MONGODB_URI || config.uri || 'mongodb://localhost:27017'
const dbName = process.env.MONGODB_DBNAME || config.dbName || 'app'

/**
 * MongoDB client instance
 * @type {MongoClient}
 */
export const client = new MongoClient(uri)

/**
 * Create connection to MongoDB
 * @throws {Error} If connection fails
 */
export async function connect() {
    try {
        await client.connect()
        // console.log("✅ Successfully connected to MongoDB")
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error)
        await client.close() // Close connection if failure occurs
        throw error // Re-throw error for handling at application level
    }
}

/**
 * Get MongoDB database instance
 * @returns {import('mongodb').Db}
 */
export function getDb() {
    return client.db(dbName)
}

/**
 * Get collection from database
 * @param {string} collectionName - Name of the collection to access
 * @returns {Promise<Collection>} Instance collection MongoDB
 */
export async function getCollection(collectionName: string) {
    const db = await getDb()
    return db.collection(collectionName)
}` 