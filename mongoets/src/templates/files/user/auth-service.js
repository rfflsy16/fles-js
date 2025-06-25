export default `import { {{MODEL_LC}}Repository } from "./{{MODEL_LC}}.repository"
import type { Create{{MODEL}} } from "./{{MODEL_LC}}.schema"
import { Create{{MODEL}}Schema } from "./{{MODEL_LC}}.schema"
import { hash, compare } from "@utils/bcrypt"
import { createToken } from "@utils/jwt"

export class Auth{{MODEL}}Service {
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

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user

            return {
                success: true,
                status: 200,
                data: { user: userWithoutPassword, token }
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

            // Remove password from response
            const { password: _, ...userWithoutPassword } = result

            return { 
                success: true, 
                status: 201, 
                data: { user: userWithoutPassword, token } 
            }

        } catch (error) {
            throw error
        }
    }
}` 