export default `import { z } from "zod"
import { ObjectId } from "mongodb"

/*
 * 📚 Quick Zod Guide:
 * 
 * Contoh validasi dgn message:
 * const userSchema = z.object({
 *    name: z.string().min(2, "Minimal 2 karakter"),
 *    email: z.string().email("Email tidak valid"),
 *    age: z.number().min(17, "Minimal umur 17 tahun")
 * })
 */

// Base schema yg shared di semua operations
const {{MODEL}}BaseSchema = z.object({
{{FIELDS}}
})

const WithIdSchema = z.object({
    _id: z.instanceof(ObjectId)
})

const TimestampSchema = z.object({
    createdAt: z.date(),
    updatedAt: z.date()
})

const {{MODEL}}IdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/)
})

const Create{{MODEL}}Schema = {{MODEL}}BaseSchema

const {{MODEL}}Schema = {{MODEL}}BaseSchema
    .merge(WithIdSchema)
    .merge(TimestampSchema)

const Update{{MODEL}}Schema = {{MODEL}}BaseSchema.partial()

// Export types
export type Create{{MODEL}} = z.infer<typeof Create{{MODEL}}Schema>
export type {{MODEL}} = z.infer<typeof {{MODEL}}Schema>
export type Update{{MODEL}} = z.infer<typeof Update{{MODEL}}Schema>
export type {{MODEL}}Id = z.infer<typeof {{MODEL}}IdSchema>

// Export schemas
export {
    Create{{MODEL}}Schema,
    {{MODEL}}Schema,
    Update{{MODEL}}Schema,
    {{MODEL}}IdSchema
}` 