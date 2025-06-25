export default `import { connect, getDb } from "@config/mongodb";
{{IMPORTS}}

/*
 * 📚 Tutorial: Seeding Process
 * 1. This is the main seeder file that manages all seeding operations
 * 2. First, it will drop existing collections to clean the data
 * 3. Then it runs all seeders simultaneously using Promise.all
 */

async function dropCollections() {
    /* 
     * 🔍 How dropCollections works:
     * - Get database connection
     * - Try to drop each collection
     * - Handle case if collection doesn't exist yet
     */
    try {
        const db = await getDb();
        
        const collections = [{{COLLECTIONS}}];

        for (const collectionName of collections) {
            try {
                await db.collection(collectionName).drop();
            } catch {
                console.log(\`⚠️ \${collectionName} collection not found, skipping...\`);
            }
        }

        console.log("✨ Successfully dropped all collections!");
    } catch (error) {
        console.error("❌ Failed to drop collections:", error);
        throw error;
    }
}

async function seed() {
    /* 
     * 🌱 Seeding Process Steps:
     * 1. Connect to MongoDB
     * 2. Drop existing collections
     * 3. Run all seeders concurrently
     * 4. Exit process when complete
     */
    try {
        await connect();
        await dropCollections();

        await Promise.all([
            {{SEEDERS}}
        ]);

        console.log("🌱 Seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        process.exit(0);
    }
}

seed();` 