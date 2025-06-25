import { MongoClient } from 'mongodb'
import fs from 'fs'
import path from 'path'

/**
 * Base Model class utk di-extend sama semua model
 */
export class Model {
    static async getDb() {
        const env = process.env.NODE_ENV || 'development'
        const configPath = path.join(process.cwd(), 'config', 'mongodb.json')
        
        try {
            const config = JSON.parse(fs.readFileSync(configPath))[env]
            const client = new MongoClient(config.uri)
            await client.connect()
            return client.db(config.name)
        } catch (error) {
            console.error('❌ MongoDB Error:', error)
            throw error
        }
    }
}

// Export templates utk CLI
export { default as templates } from './templates/index.js'