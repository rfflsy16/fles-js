export default `import { getCollection } from "../../config/mongodb"
import { ObjectId } from "mongodb"

import type { 
    Create{{MODEL}}, 
    {{MODEL}},
    {{MODEL}}Id,
    Update{{MODEL}} 
} from "./{{MODEL_LC}}.schema"

const {{MODEL_LC_PLURAL}} = await getCollection("{{MODEL_PLURAL}}")

export const {{MODEL_LC}}Repository = {
    
    create: async (data: Create{{MODEL}}) => {
        const result = await {{MODEL_LC_PLURAL}}.insertOne({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        return { _id: result.insertedId, ...data } as {{MODEL}}
    },

    findAll: async () => {
        return await {{MODEL_LC_PLURAL}}.find().toArray() as {{MODEL}}[]
    },

    findById: async ({ id }: {{MODEL}}Id) => {
        return await {{MODEL_LC_PLURAL}}.findOne(
            { _id: new ObjectId(id) }
        ) as {{MODEL}} | null
    },

    update: async ({ id }: {{MODEL}}Id, data: Update{{MODEL}}) => {
        return await {{MODEL_LC_PLURAL}}.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { ...data, updatedAt: new Date() } },
            { returnDocument: "after" }
        )
    },

    delete: async ({ id }: {{MODEL}}Id) => {
        return await {{MODEL_LC_PLURAL}}.findOneAndDelete(
            { _id: new ObjectId(id) }
        )
    }
}` 