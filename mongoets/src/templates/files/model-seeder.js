export default `import fs from "fs/promises";
import { getCollection } from "@config/mongodb";
import { ObjectId } from "mongodb";
import type { {{MODEL}} } from "@modules/{{MODEL_LC}}/{{MODEL_LC}}.schema";

/* 
 * 📚 Tutorial Model Seeder:
 * 1. This template creates a seeder for each model
 * 2. It reads data from JSON file in src/data/
 * 3. Adds required fields like _id, createdAt, updatedAt
 * 4. Inserts data into MongoDB
 */

const collectionName = "{{MODEL_PLURAL}}"

export const seed{{MODEL_PLURAL}} = async () => {
    /* 
     * 🔄 Seeding Steps:
     * 1. Get collection reference
     * 2. Read JSON data
     * 3. Transform data (add IDs & timestamps)
     * 4. Insert into database
     */
    try {
        const {{MODEL_LC}}Collection = await getCollection(collectionName);

        const {{MODEL_LC_PLURAL}} = JSON.parse(
            await fs.readFile("./src/data/{{MODEL_LC_PLURAL}}.json", "utf-8")
        );

        {{MODEL_LC_PLURAL}}.map((el: {{MODEL}}) => {
            el._id = new ObjectId();
            el.createdAt = new Date();
            el.updatedAt = new Date();
            return el;
        });

        await {{MODEL_LC}}Collection.insertMany({{MODEL_LC_PLURAL}});
        console.log("{{MODEL}} seeding completed successfully.");
    } catch (error) {
        console.error("Error seeding {{MODEL_LC_PLURAL}}:", error);
    }
}` 