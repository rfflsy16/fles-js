export default `import { getCollection } from "../../config/mongodb"
import { ObjectId } from "mongodb"

import type { 
    Create{{MODEL}}, 
    {{MODEL}},
    {{MODEL}}Id,
    Update{{MODEL}} 
} from "./{{MODEL_LC}}.schema"

const {{MODEL_LC}}s = await getCollection("{{MODEL}}s")

export const {{MODEL_LC}}Repository = {
    
    create: async (data: Create{{MODEL}}) => {
        const result = await {{MODEL_LC}}s.insertOne({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        return { _id: result.insertedId, ...data } as {{MODEL}}
    },

    findAll: async () => {
        return await {{MODEL_LC}}s.find({}, { projection: { password: 0 } }).toArray() as {{MODEL}}[]
    },

    findById: async ({ id }: {{MODEL}}Id) => {
        return await {{MODEL_LC}}s.findOne(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        ) as {{MODEL}} | null
    },

    // Khusus User: findByEmail (tetap include password utk login)
    findByEmail: async (email: string) => {
        return await {{MODEL_LC}}s.findOne({ email }) as {{MODEL}} | null
    },

    update: async ({ id }: {{MODEL}}Id, data: Update{{MODEL}}) => {
        const result = await {{MODEL_LC}}s.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { ...data, updatedAt: new Date() } },
            { 
                returnDocument: "after",
                projection: { password: 0 }
            }
        )
        return result
    },

    delete: async ({ id }: {{MODEL}}Id) => {
        const result = await {{MODEL_LC}}s.findOneAndDelete(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        )
        return result
    }
}` 