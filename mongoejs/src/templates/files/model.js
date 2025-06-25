import { Model } from '@henscc/mongoejs'
import { ObjectId } from 'mongodb'

export class MODELNAME extends Model {
    static collection = 'COLLECTION'
    
    static fields = {
FIELDS
    }

    // Find All
    static async findAll(options = {}) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        return await collection.find(options.where || {}).toArray()
    }

    // Find One
    static async findOne(options = {}) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        return await collection.findOne(options.where || {})
    }

    // Find By Primary Key
    static async findByPk(id) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        return await collection.findOne({ _id: new ObjectId(id) })
    }

    // Create
    static async create(data, options = {}) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        const doc = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const result = await collection.insertOne(doc)
        return { _id: result.insertedId, ...doc }
    }

    // Bulk Create
    static async bulkCreate(data, options = {}) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        const docs = data.map(item => ({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
        }))
        const result = await collection.insertMany(docs)
        return docs.map((doc, index) => ({ 
            _id: result.insertedIds[index], 
            ...doc 
        }))
    }

    // Update
    static async update(data, options = {}) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        const result = await collection.updateMany(
            options.where || {},
            { 
                $set: { 
                    ...data,
                    updatedAt: new Date()
                } 
            }
        )
        return result
    }

    // Delete
    static async destroy(options = {}) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        return await collection.deleteMany(options.where || {})
    }

    // Count
    static async count(options = {}) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        return await collection.countDocuments(options.where || {})
    }

    // Find And Count All
    static async findAndCountAll(options = {}) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        const rows = await collection.find(options.where || {}).toArray()
        const count = await collection.countDocuments(options.where || {})
        return { rows, count }
    }

    // IncrementAll
    static async increment(fields, options = {}) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        const inc = {}
        if (typeof fields === 'string') {
            inc[fields] = 1
        } else {
            Object.keys(fields).forEach(key => {
                inc[key] = fields[key]
            })
        }
        return await collection.updateMany(
            options.where || {},
            { 
                $inc: inc,
                $set: { updatedAt: new Date() }
            }
        )
    }

    // Decrement
    static async decrement(fields, options = {}) {
        const db = await Model.getDb()
        const collection = db.collection(MODELNAME.collection)
        const dec = {}
        if (typeof fields === 'string') {
            dec[fields] = -1
        } else {
            Object.keys(fields).forEach(key => {
                dec[key] = -fields[key]
            })
        }
        return await collection.updateMany(
            options.where || {},
            { 
                $inc: dec,
                $set: { updatedAt: new Date() }
            }
        )
    }
}