export default `import { {{MODEL_LC}}Repository } from "./{{MODEL_LC}}.repository"
import type { Create{{MODEL}}, {{MODEL}}Id, Update{{MODEL}} } from "./{{MODEL_LC}}.schema"
import { Create{{MODEL}}Schema, {{MODEL}}IdSchema, Update{{MODEL}}Schema } from "./{{MODEL_LC}}.schema"
import { hash, compare } from "@utils/bcrypt"
import { createToken } from "@utils/jwt"

export class {{MODEL}}Service {
    static async create{{MODEL}}({{MODEL_LC}}: Create{{MODEL}}) {
        try {
            const validated = Create{{MODEL}}Schema.parse({{MODEL_LC}})
            
            // Hash password before saving
            validated.password = await hash(validated.password)
            
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

    static async getAll{{MODEL}}s() {
        try {
            const {{MODEL_LC}}s = await {{MODEL_LC}}Repository.findAll()

            if ({{MODEL_LC}}s.length === 0) {
                throw new Error("No {{MODEL_LC}}s found")
            }

            return { 
                success: true, 
                status: 200, 
                data: {{MODEL_LC}}s 
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
            
            // Hash password if it's being updated
            if (validated.password) {
                validated.password = await hash(validated.password)
            }
            
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

    // Auth methods
    static async login(email: string, password: string) {
        try {
            const user = await {{MODEL_LC}}Repository.findByEmail(email)
            
            if (!user) {
                throw new Error("Invalid credentials")
            }

            const isValidPassword = await compare(password, user.password)
            
            if (!isValidPassword) {
                throw new Error("Invalid credentials")
            }

            const token = await createToken({
                userId: user._id.toString(),
                email: user.email
            })

            return {
                success: true,
                status: 200,
                data: { user, token }
            }
        } catch (error) {
            throw error
        }
    }

    static async register(data: Create{{MODEL}}) {
        try {
            const validated = Create{{MODEL}}Schema.parse(data)
            
            // Check if email already exists
            const existing = await {{MODEL_LC}}Repository.findByEmail(validated.email)
            if (existing) {
                throw new Error("Email already registered")
            }
            
            // Hash password
            validated.password = await hash(validated.password)
            
            const result = await {{MODEL_LC}}Repository.create(validated)
            const token = await createToken({
                userId: result._id.toString(),
                email: result.email
            })

            return { 
                success: true, 
                status: 201, 
                data: { user: result, token } 
            }

        } catch (error) {
            throw error
        }
    }
}`
