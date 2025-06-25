export default `import { {{MODEL_LC}}Repository } from "./{{MODEL_LC}}.repository"
import type { Create{{MODEL}}, {{MODEL}}Id, Update{{MODEL}} } from "./{{MODEL_LC}}.schema"
import { Create{{MODEL}}Schema, {{MODEL}}IdSchema, Update{{MODEL}}Schema } from "./{{MODEL_LC}}.schema"

export class {{MODEL}}Service {

    static async create{{MODEL}}({{MODEL_LC}}: Create{{MODEL}}) {
        try {
            const validated = Create{{MODEL}}Schema.parse({{MODEL_LC}})
            const result = await {{MODEL_LC}}Repository.create(validated)

            return { 
                success: true, 
                status: 201, 
                data: result 
            }

        } catch (error) {
            throw error
        }
    }

    static async getAll{{MODEL_PLURAL}}() {
        try {
            const {{MODEL_LC_PLURAL}} = await {{MODEL_LC}}Repository.findAll()

            if ({{MODEL_LC_PLURAL}}.length === 0) {
                throw new Error("No {{MODEL_LC_PLURAL}} found")
            }

            return { 
                success: true, 
                status: 200, 
                data: {{MODEL_LC_PLURAL}} 
            }
            
        } catch (error) {
            throw error
        }
    }

    static async get{{MODEL}}ById(params: {{MODEL}}Id) {
        try {
            const { id } = {{MODEL}}IdSchema.parse(params)
            const {{MODEL_LC}} = await {{MODEL_LC}}Repository.findById({ id })

            if (!{{MODEL_LC}}) {
                throw new Error("{{MODEL}} not found")
            }

            return { 
                success: true, 
                status: 200, 
                data: {{MODEL_LC}} 
            }

        } catch (error) {
            throw error
        }
    }

    static async update{{MODEL}}(params: {{MODEL}}Id, data: Update{{MODEL}}) {
        try {
            const { id } = {{MODEL}}IdSchema.parse(params)
            const validated = Update{{MODEL}}Schema.parse(data)
            
            const result = await {{MODEL_LC}}Repository.update({ id }, validated)
            
            if (!result) {
                throw new Error("{{MODEL}} not found")
            }

            return { 
                success: true, 
                status: 200, 
                data: result 
            }

        } catch (error) {
            throw error
        }
    }

    static async delete{{MODEL}}(params: {{MODEL}}Id) {
        try {
            const { id } = {{MODEL}}IdSchema.parse(params)
            const result = await {{MODEL_LC}}Repository.delete({ id })

            if (!result) {
                throw new Error("{{MODEL}} not found")
            }

            return { 
                success: true, 
                status: 200, 
                data: result 
            }

        } catch (error) {
            throw error
        }
    }
}` 