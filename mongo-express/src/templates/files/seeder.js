'use strict';

import { MODELNAME } from '../models/index.js'
import fs from 'fs/promises'
import { ObjectId } from 'mongodb'

/** @type {import('fles-mongo-express').Seeder} */
export default {
    /**
     * @param {import('mongodb').Db} db - MongoDB database instance
     */
    up: async () => {
        const db = await MODELNAME.getDb()
        const collection = db.collection('COLLECTION')
        
        // Read & parse JSON data
        const rawData = JSON.parse(
            await fs.readFile('./data/COLLECTION.json', 'utf-8')
        )
        
        // Transform _id to ObjectId
        const data = rawData.map(item => ({
            ...item,
            _id: new ObjectId(item._id),
            createdAt: new Date(),
            updatedAt: new Date()
        }))
        
        await collection.insertMany(data)
    },

    /**
     * @param {import('mongodb').Db} db - MongoDB database instance
     */
    down: async () => {
        const db = await MODELNAME.getDb()
        const collection = db.collection('COLLECTION')
        await collection.deleteMany({})
    }
} 