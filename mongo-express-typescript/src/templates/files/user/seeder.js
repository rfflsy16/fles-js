export default `import fs from "fs/promises"
import { getCollection } from "@config/mongodb"
import { ObjectId } from "mongodb"
import type { User } from "@modules/user/user.schema"
import { hash } from "@utils/bcrypt"

const collectionName = "Users"

export const seedUsers = async () => {
    try {
        const userCollection = await getCollection(collectionName)

        const users = JSON.parse(
            await fs.readFile("./src/data/users.json", "utf-8")
        )

        // Hash passwords before inserting
        const usersWithHashedPasswords = await Promise.all(
            users.map(async (el: User) => {
                el._id = new ObjectId()
                el.password = await hash(el.password)
                el.createdAt = new Date()
                el.updatedAt = new Date()
                return el
            })
        )

        await userCollection.insertMany(usersWithHashedPasswords)
        console.log("User seeding completed successfully.")
    } catch (error) {
        console.error("Error seeding users:", error)
    }
}` 